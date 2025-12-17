export class JsonParser {
    public static safeParse<T>(str: string, callBack?: (str: string, err: Error) => void): T | null {
        try {
            return JSON.parse(str);
        } catch (e) {
            callBack?.(str, e as Error);
            return null;
        }
    }

    public static async safeResponseParse<T>(response: Response): Promise<T | null> {
        try {
            return await response.json() as T;
        } catch {
            return null;
        }
    }
}
