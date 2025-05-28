export class Logger {
    public static devLog(...params: any): void {
        if ((process?.env?.NODE_ENV === 'development' || import.meta.env?.DEV) && typeof window !== 'undefined') {
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
