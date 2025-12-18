export default class ObjectResolver {
    /**
     * Filters the properties of an object based on a predicate function that resolve the objet key.
     * @param obj The object to filter.
     * @param predicate A function that determines whether a property should be included.
     * @returns A new object with only the properties that satisfy the predicate.
     */
    public static filterRecord<T extends Record<string, any>>(
        obj: T,
        predicate: (value: string) => boolean
    ): Partial<T> {
        return Object.fromEntries(Object.entries(obj).filter(([value]) => predicate(value))) as Partial<T>;
    }

    /**
     * Verfies if an object is empty (has no own properties).
     * @param obj The object to check.
     * @returns True if the object is empty, false otherwise.
     */
    public static isEmpty(obj: Record<string, any>): boolean {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    /**
     * Verifies if the provided values are deeply equal.
     * @param params The values to compare.
     * @returns True if each value is deeply equal to the next, false otherwise.
     */
    public static equals(...params: any[]): boolean {
        if (params.length < 2) return true;

        function eq(a: any, b: any): boolean {
            if (a === null && b === null) {
                return true;
            }
            if (a === null || b === null) {
                return false;
            }
            if (a === undefined && b === undefined) {
                return true;
            }
            if (a === undefined || b === undefined) {
                return false;
            }
            if (Array.isArray(a) && Array.isArray(b)) {
                if (a.length !== b.length) return false;
                return a.every((v, i) => eq(v, b[i]));
            }
            if (Array.isArray(a) || Array.isArray(b)) {
                return false;
            }
            if (typeof a === 'object' && typeof b === 'object') {
                const ka = Object.keys(a);
                const kb = Object.keys(b);
                if (ka.length !== kb.length) return false;
                return ka.every(k => eq(a[k], b[k]));
            }
            if (typeof a === 'object' || typeof b === 'object') {
                return false;
            }
            if (typeof a !== typeof b) {
                return false;
            }

            return a === b;
        }

        return params.every((v, i, arr) => {
            if (i === 0) return true;
            return eq(v, arr[i - 1]);
        });
    }
}
