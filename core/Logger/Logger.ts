export class Logger {
    public static devLog(...params: any): void {
        const isDev =
            (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') ||
            (typeof import.meta !== 'undefined' && import.meta.env?.DEV);

        if (isDev) {
            console.log(`${new Date().toLocaleTimeString()} |`, ...params);
        }
    }

    public static setupLogFilter(filter: (msg: string) => boolean) {
        function override(fnName: 'log' | 'warn' | 'error') {
            const original = console[fnName].bind(console);
            console[fnName] = (...args: any[]) => {
                if (filter(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '))) {
                    return;
                }
                original(...args);
            };
        }

        override('log');
        override('warn');
        override('error');
    }
}
