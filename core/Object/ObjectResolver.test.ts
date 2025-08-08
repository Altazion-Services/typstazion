import { expect, test } from 'vitest';
import ObjectResolver from './ObjectResolver';

test('ObjectResolver.filterRecord(), Should filter object properties based on predicate', () => {
    [
        {
            obj: { a: 1, b: 2, c: 3 },
            predicate: (key: string) => key === 'a',
            expected: { a: 1 },
        },
        {
            obj: { name: 'John', age: 30, city: 'Paris' },
            predicate: (key: string) => ['name', 'city'].includes(key),
            expected: { name: 'John', city: 'Paris' },
        },
        {
            obj: { foo: true, bar: false, baz: true },
            predicate: () => false,
            expected: {},
        },
        {
            obj: {},
            predicate: () => true,
            expected: {},
        },
    ].forEach(({ obj, predicate, expected }) => expect(ObjectResolver.filterRecord(obj, predicate)).toEqual(expected));
});
