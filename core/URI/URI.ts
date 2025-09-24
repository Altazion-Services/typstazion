export default class URI {
    public static resolve(...paths: Array<string>) {
        return paths
          .join("/") 
          .replace(/(^|[^:])\/{2,}/g, "$1/") 
          .replace(/\/+$/, "");
    }

    public static removePort(url: string) {
        return url.replace(/:\d+/, '');
    }

    public static enforceHtmExtension(path: string) {
        return path === '/' || path.endsWith('.htm')
            ? path
            : `${path.endsWith('.html') ? path.split('.html')[0] : path}.htm`;
    }

    public static buildQueryString(
        params: Record<string, string | number | boolean | null | undefined | Array<string>> | undefined
    ): string {
        if (!params || typeof params !== 'object') {
            return '';
        }

        const query = Object.entries(params)
            .filter(([, value]) => value !== null && value !== undefined)
            .flatMap(([key, value]) => {
                if (Array.isArray(value)) {
                    return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
                }
                return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
            })
            .join('&');

        return query ? `?${query}` : '';
    }

    public static getGuid(str: string) {
        const match = str.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
        return match?.[0];
    }
}
