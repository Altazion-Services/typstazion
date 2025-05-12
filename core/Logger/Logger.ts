export class Logger {
    public static devLog(...params: any): void {
        if ((process?.env?.NODE_ENV === 'development' || import.meta.env?.DEV) && typeof window !== 'undefined') {
            console.log(`${new Date().toLocaleTimeString()} |`, ...params);
        }
    }
}
