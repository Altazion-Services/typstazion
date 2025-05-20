export default class URI {
    public static resolve(...paths: Array<string>) {
        return paths
            .map((part, index) => (index === 0 ? part.replace(/\/+$/, '') : part.replace(/^\/+|\/+$/g, '')))
            .filter(Boolean)
            .join('/')
            .replace(/([^:]\/)\/+/g, '$1');
    }

    public static enforceHtmExtension(path: string) {
        return path === '/' || path.endsWith('.htm')
            ? path
            : `${path.endsWith('.html') ? path.split('.html')[0] : path}.htm`;
    }
}
