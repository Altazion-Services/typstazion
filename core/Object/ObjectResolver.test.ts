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

test('ObjectResolver.equals(), Should correctly compare deep equality', () => {
    [
        {
            values: [1, 1],
            expected: true,
        },
        {
            values: [1, 2],
            expected: false,
        },
        {
            values: ['a', 'a', 'a'],
            expected: true,
        },
        {
            values: ['a', 'a', 'b'],
            expected: false,
        },
        {
            values: [
                [1, 2],
                [1, 2],
            ],
            expected: true,
        },
        {
            values: [
                [1, 2],
                [2, 1],
            ],
            expected: false,
        },
        {
            values: [{ a: 1 }, { a: 1 }],
            expected: true,
        },
        {
            values: [{ a: 1 }, { a: 2 }],
            expected: false,
        },
        {
            values: [{ a: { b: 2 } }, { a: { b: 2 } }],
            expected: true,
        },
        {
            values: [{ a: 1 }, { a: 1 }, { a: 1 }],
            expected: true,
        },
        {
            values: [{ a: 1 }, { a: 1 }, { a: 2 }],
            expected: false,
        },
        {
            values: [null, null],
            expected: true,
        },
        {
            values: [null, undefined],
            expected: false,
        },
        {
            values: [],
            expected: true,
        },
        {
            values: [42],
            expected: true,
        },
    ].forEach(({ values, expected }) => expect(ObjectResolver.equals(...values)).toBe(expected));
});
