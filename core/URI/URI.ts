export default class URI {
    public static resolve(...paths: Array<string>) {
        return paths.map(str => str.replace(new RegExp('^/|/$', 'g'), '')).join('/');
    }

    public static enforceHtmExtension(path: string) {
        return path === '/' || path.endsWith('.htm')
            ? path
            : `${path.endsWith('.html') ? path.split('.html')[0] : path}.htm`;
    }
}
