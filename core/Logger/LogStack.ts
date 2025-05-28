import { Logger } from './Logger';

export class LogStack {
    private static stack: { key: string; cb: () => void }[] = [];
    private static readonly separator = new Array(100).fill('-').join('');

    public static add(key: string, ...params: any): void {
        this.stack.push({ key, cb: () => Logger.devLog(...params) });
    }

    public static clear(): void {
        this.stack = [];
    }

    public static printStack(key: string): void {
        console.log(this.separator);
        for (const { cb } of this.stack.filter(x => x.key === key)) {
            cb();
        }
        console.log(this.separator);
        this.clear();
    }
}
