export class Logger {
    public static devLog(...params: unknown[]): void {
        const isDev =
            (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') ||
            (typeof import.meta !== 'undefined' && import.meta.env?.DEV);

        if (isDev) {
            const safeParams = params.map((p: unknown) => {
                if (typeof p === 'string') return p;
                try {
                    return JSON.stringify(p);
                } catch (e) {
                    return '[Unserializable object]';
                }
            });
            console.log(`${new Date().toLocaleTimeString()} |`, ...safeParams);
        }
    }

    public static setupLogFilter(filter: (msg: string) => boolean) {
        function override(fnName: 'log' | 'warn' | 'error') {
            const original = console[fnName].bind(console);
            console[fnName] = (...args: unknown[]) => {
                const safeArgs = args.map((a: unknown) => {
                    if (typeof a === 'string') return a;
                    try {
                        return JSON.stringify(a);
                    } catch (e) {
                        return '[Unserializable object]';
                    }
                });
                if (filter(safeArgs.join(' '))) {
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
