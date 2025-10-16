export class ClassName {
    public static merge(...strings: (string | undefined)[]): string {
        return strings.filter(Boolean).join(' ');
    }
}
