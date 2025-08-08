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
}
