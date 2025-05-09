export class Logger {
    public static devLog(...params: any): void {
        if (process?.env?.NODE_ENV === 'development' || (window && import.meta.env?.DEV)) {
            console.log(`${new Date().toLocaleTimeString()} |`, ...params);
        }
    }
}
