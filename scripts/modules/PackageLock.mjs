import fs from 'fs';
import Logger from './Logger.mjs';

export default class PackageLock {
    /**
     * Get the content of package-lock.json
     * @returns {Object}
     */
    static getPackageLock = () => JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));

    /**
     * Get the list of infected packages
     * See https://github.com/DataDog/malicious-software-packages-dataset for further information
     * @returns {Promise<{[string]: null | Array<string> }>}
     */
    static async getCompromisedPackagesAsync() {
        const source =
            'https://raw.githubusercontent.com/DataDog/malicious-software-packages-dataset/refs/heads/main/samples/npm/manifest.json';
        const response = await fetch(source);
        return await response.json();
    }

    /**
     * Find a package in the lock file
     * @param {string} pkgName Package name to find
     * @return {Array<{path: string, name: string, data: Object}>}
     */
    static findPackage(pkgName) {
        const lock = this.getPackageLock();
        const deps = lock.packages ?? lock.dependencies ?? {};
        const results = [];

        function scan(obj, path = '') {
            for (const [name, data] of Object.entries(obj)) {
                if (name === pkgName || name.endsWith(`node_modules/${pkgName}`)) {
                    results.push({ path, name, data });
                }
                if (data.dependencies) {
                    scan(data.dependencies, `${path}/${name}`);
                }
            }
        }

        scan(deps);
        return results;
    }

    /**
     * Validate packages based on the compromisedPackages list
     * @returns {Promise<void>}
     */
    static async validateAsync() {
        const processId = 'PACKAGE-LOCK-VALIDATION';
        let errorCount = 0;

        console.log(`[${processId}]`, 'Starting package-lock.json validation...');
        Logger.startTrace(processId, 'package-lock.json validation result:');
        const list = await this.getCompromisedPackagesAsync();
        for (const [pkg, versions] of Object.entries(list)) {
            const matches = this.findPackage(pkg);

            for (const m of matches) {
                if (!m.data.version) {
                    continue;
                }

                const resolved = m.data.resolved ?? '';
                if (m.data.version && !versions) {
                    Logger.traceWarning(
                        processId,
                        `${pkg} => compromised package found!!! (${m.path} - ${m.data.version} - ${resolved})`
                    );
                    errorCount++;
                    continue;
                }
                for (const version of versions) {
                    if (m.data.version === version || resolved.includes(`-${version}.tgz`)) {
                        Logger.traceWarning(
                            processId,
                            `${pkg} => ${version} compromised version found!!! (${resolved})`
                        );
                        errorCount++;
                    }
                }
            }
        }
        if (errorCount === 0) {
            Logger.traceSuccess(processId, `No vulnerability found in package-lock.json`);
        } else {
            Logger.traceCritical(processId, `${errorCount} vulnerability(ies) found`);
            Logger.traceCritical(
                processId,
                `Please remove your package-lock.json file and node_modules folder, clean your npm cache using 'npm cache clean --force' and fix your package.json dependencies before reinstalling everything using 'npm install'`
            );
        }
        Logger.endTrace(processId);
    }
}
