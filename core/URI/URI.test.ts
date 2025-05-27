import { expect, test } from 'vitest';
import URI from './URI';

test('URI.resolve(), Should return a formatted url', () =>
    [
        { test: ['https://example.com/', 'auth', 'login'], result: 'https://example.com/auth/login' },
        { test: ['https://example.com', 'auth', 'login'], result: 'https://example.com/auth/login' },
        { test: ['https://example.com', '/auth', '/login/'], result: 'https://example.com/auth/login' },
        { test: ['https://example.com', '/auth', 'login'], result: 'https://example.com/auth/login' },
        { test: ['https://////example.com', '/auth//', '/////login'], result: 'https://example.com/auth/login' },
        { test: ['https:///example.com//lol', '/auth//', '/////login'], result: 'https://example.com/lol/auth/login' },
    ].forEach(({ test, result }) => expect(URI.resolve(...test)).toBe(result)));

test('URI.enforceHtmExtension(), Should add .htm when needed', () => {
    [
        { input: '/', expected: '/' },
        { input: '/page', expected: '/page.htm' },
        { input: '/page.htm', expected: '/page.htm' },
        { input: '/page.html', expected: '/page.htm' },
        { input: '/some/path/page', expected: '/some/path/page.htm' },
        { input: '/some/path/page.html', expected: '/some/path/page.htm' },
        { input: '/some/path/page.htm', expected: '/some/path/page.htm' },
    ].forEach(({ input, expected }) => expect(URI.enforceHtmExtension(input)).toBe(expected));
});

test('URI.buildQueryString(), Should build a query string from an object', () => {
    [
        {
            expected: '',
            params: { a: null, b: undefined },
        },
        {
            expected: '?page=1&key=value&query=name%3Asome%20name&query=category%3Acategory&active=true',
            params: {
                page: 1,
                key: 'value',
                query: ['name:some name', 'category:category'],
                active: true,
                empty: null,
                undefinedValue: undefined,
            },
        },
    ].forEach(({ expected, params }) => expect(URI.buildQueryString(params)).toBe(expected));
});
