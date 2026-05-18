import fs from "fs";
import Logger from "./Logger.mjs";

const NPM_LOCK_FILE = "package-lock.json";
const PNPM_LOCK_FILE = "pnpm-lock.yaml";

export default class PackageLock {
  static usePnpm = process.argv.includes("--pnpm");

  /**
   * Get the lockfile name based on the active package manager
   * @returns {string}
   */
  static getLockFileName = () =>
    this.usePnpm ? PNPM_LOCK_FILE : NPM_LOCK_FILE;

  /**
   * Get the content of package-lock.json
   * @returns {Object}
   */
  static getPackageLock = () =>
    JSON.parse(fs.readFileSync(NPM_LOCK_FILE, "utf8"));

  /**
   * Get the list of infected packages
   * See https://github.com/DataDog/malicious-software-packages-dataset for further information
   * @returns {Promise<{[string]: null | Array<string> }>}
   */
  static async getCompromisedPackagesAsync() {
    const source =
      "https://raw.githubusercontent.com/DataDog/malicious-software-packages-dataset/refs/heads/main/samples/npm/manifest.json";
    const response = await fetch(source);
    return await response.json();
  }

  /**
   * Create an index of all packages in the npm package-lock.json
   * @returns {Object}
   */
  static indexNpmPackages() {
    const lock = this.getPackageLock();
    const deps = lock.packages ?? lock.dependencies ?? {};
    const index = {};

    function scan(obj) {
      for (const [name, data] of Object.entries(obj)) {
        if (data) {
          index[name] = data;
          if (data.dependencies) scan(data.dependencies);
        }
      }
    }

    scan(deps);
    return index;
  }

  /**
   * Create an index of all packages from pnpm-lock.yaml.
   * Minimal YAML parser tailored to pnpm-lock format v6+ — extracts package
   * names, versions and tarball URLs from the top-level `packages:` section.
   * @returns {Object}
   */
  static indexPnpmPackages() {
    const content = fs.readFileSync(PNPM_LOCK_FILE, "utf8");
    const lines = content.split("\n");
    const index = {};

    let inPackages = false;
    let currentName = null;

    for (const line of lines) {
      const topLevel = line.match(/^([a-zA-Z][\w-]*):\s*$/);
      if (topLevel) {
        inPackages = topLevel[1] === "packages";
        currentName = null;
        continue;
      }

      if (!inPackages) continue;

      const entry = line.match(/^ {2}'?([^':]+(?:@[^':]+)?)'?:\s*$/);
      if (entry) {
        const key = entry[1];
        const parsed = key.match(
          /^((?:@[^/]+\/)?[^@]+)@([^(]+?)(?:\([^)]*\))?$/,
        );
        if (parsed) {
          const name = parsed[1];
          const version = parsed[2].trim();
          currentName = name;
          if (!index[name]) index[name] = { version, resolved: "" };
        } else {
          currentName = null;
        }
        continue;
      }

      if (currentName && /^ {4}resolution:/.test(line)) {
        const tarball = line.match(/tarball:\s*([^\s,}]+)/);
        if (tarball) index[currentName].resolved = tarball[1];
      }
    }

    return index;
  }

  /**
   * Create an index of all packages from the active lockfile
   * @returns {Object}
   */
  static indexPackages() {
    return this.usePnpm ? this.indexPnpmPackages() : this.indexNpmPackages();
  }

  /**
   * Validate packages based on the compromisedPackages list
   * @returns {Promise<void>}
   */
  static async validateAsync() {
    const processId = "PACKAGE-LOCK-VALIDATION";
    const lockFile = this.getLockFileName();
    let errorCount = 0;

    console.log(`[${processId}]`, `Starting ${lockFile} validation...`);
    Logger.startTrace(processId, `${lockFile} validation result:`);

    const compromisedList = await this.getCompromisedPackagesAsync();
    const packageIndex = this.indexPackages();

    const compromisedSet = new Set(Object.keys(compromisedList));
    const installedSet = new Set(Object.keys(packageIndex));

    const intersection = [...installedSet].filter((pkg) =>
      compromisedSet.has(pkg),
    );

    for (const pkg of intersection) {
      const data = packageIndex[pkg];
      const versions = compromisedList[pkg];
      if (!data || !data.version) continue;

      const resolved = data.resolved ?? "";

      if (!versions) {
        Logger.traceWarning(
          processId,
          `${pkg} => compromised package found!!! (${data.version} - ${resolved})`,
        );
        errorCount++;
        continue;
      }

      const versionSet = new Set(versions);
      if (
        versionSet.has(data.version) ||
        versions.some((v) => resolved.includes(`-${v}.tgz`))
      ) {
        Logger.traceWarning(
          processId,
          `${pkg} => ${data.version} compromised version found!!! (${resolved})`,
        );
        errorCount++;
      }
    }

    if (errorCount === 0) {
      Logger.traceSuccess(processId, `No vulnerability found in ${lockFile}`);
    } else {
      Logger.traceCritical(processId, `${errorCount} vulnerability(ies) found`);
      Logger.traceCritical(
        processId,
        this.usePnpm
          ? `Please remove your pnpm-lock.yaml file and node_modules folder, clean your pnpm store using 'pnpm store prune' and fix your package.json dependencies before reinstalling everything using 'pnpm install'`
          : `Please remove your package-lock.json file and node_modules folder, clean your npm cache using 'npm cache clean --force' and fix your package.json dependencies before reinstalling everything using 'npm install'`,
      );
    }
    Logger.endTrace(processId);
  }
}
