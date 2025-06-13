import { expect, test } from 'vitest';
import { JsonParser } from './JsonParser';

test('JsonParser: safeParse(), Should parse JSON string', () => {
    const json = '{"name": "John"}';
    expect(JsonParser.safeParse(json)).toEqual({ name: 'John' });
});

test('JsonParser: safeParse(), Should return null for invalid JSON string', () => {
    const json = '{"name": "John"';
    expect(JsonParser.safeParse(json)).toBeNull();
});

test('JsonParser: safeParse(), Should invoke callback for invalid JSON string', () => {
    const json = '{"name": "John"';
    let str = '';
    let error = new Error();
    const callBack = (s: string, e: Error) => {
        str = s;
        error = e;
    };
    JsonParser.safeParse(json, callBack);
    expect(str).toBe(json);
    expect(error).toBeInstanceOf(Error);
});
