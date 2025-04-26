import { expect, test } from 'vitest';
import URI from './URI';

test('URI.resolve(), Should return a formatted url', () =>
    [
        { test: ['https://example.com/', 'auth', 'login'], result: 'https://example.com/auth/login' },
        { test: ['https://example.com', 'auth', 'login'], result: 'https://example.com/auth/login' },
        { test: ['https://example.com', '/auth', '/login/'], result: 'https://example.com/auth/login' },
        { test: ['https://example.com', '/auth', 'login'], result: 'https://example.com/auth/login' },
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
