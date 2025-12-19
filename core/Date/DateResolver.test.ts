import { expect, test } from 'vitest';
import { DateResolver } from './DateResolver';

test('DateResolver: getStartOfHour(), Should return the start of the hour (UTC)', () => {
    [
        { input: '2025-01-01T13:45:00Z', expected: '2025-01-01T13:00:00Z' },
        { input: '2025-01-01T00:10:01Z', expected: '2025-01-01T00:00:00Z' },
    ].forEach(({ input, expected }) =>
        expect(DateResolver.getStartOfHour(new Date(input))).toEqual(new Date(expected))
    );
});

test('DateResolver: getEndOfHour(), Should return the end of the hour (UTC)', () => {
    [
        { input: '2025-01-01T13:45:00Z', expected: '2025-01-01T13:59:59.999Z' },
        { input: '2025-01-01T00:10:01Z', expected: '2025-01-01T00:59:59.999Z' },
    ].forEach(({ input, expected }) => expect(DateResolver.getEndOfHour(new Date(input))).toEqual(new Date(expected)));
});

test('DateResolver: getStartOfDay(), Should return the start of the day (UTC)', () => {
    [
        { input: '2025-01-01T13:00:00Z', expected: '2025-01-01T00:00:00Z' },
        { input: '2025-01-01T00:10:01Z', expected: '2025-01-01T00:00:00Z' },
    ].forEach(({ input, expected }) => expect(DateResolver.getStartOfDay(new Date(input))).toEqual(new Date(expected)));
});

test('DateResolver: getEndOfDay(), Should return the end of the day (UTC)', () => {
    [
        { input: '2025-01-01T13:00:00Z', expected: '2025-01-01T23:59:59.999Z' },
        { input: '2025-01-01T00:10:01Z', expected: '2025-01-01T23:59:59.999Z' },
    ].forEach(({ input, expected }) => expect(DateResolver.getEndOfDay(new Date(input))).toEqual(new Date(expected)));
});

test('DateResolver: getStartOfIsoWeek(), Should return the first day of the ISO week', () => {
    [
        { input: '2025-01-01T00:00:00Z', expected: '2024-12-30T00:00:00Z' },
        { input: '2025-01-08T00:00:00Z', expected: '2025-01-06T00:00:00Z' },
        { input: '2025-01-15T00:00:00Z', expected: '2025-01-13T00:00:00Z' },
        { input: '2025-01-22T00:00:00Z', expected: '2025-01-20T00:00:00Z' },
        { input: '2025-01-29T00:00:00Z', expected: '2025-01-27T00:00:00Z' },
    ].forEach(({ input, expected }) =>
        expect(DateResolver.getStartOfIsoWeek(new Date(input))).toEqual(new Date(expected))
    );
});

test('DateResolver: getEndOfIsoWeek(), Should return the last day of the ISO week', () => {
    [
        { input: '2025-01-01T00:00:00Z', expected: '2025-01-05T23:59:59.999Z' },
        { input: '2025-01-08T00:00:00Z', expected: '2025-01-12T23:59:59.999Z' },
        { input: '2025-01-15T00:00:00Z', expected: '2025-01-19T23:59:59.999Z' },
        { input: '2025-01-22T00:00:00Z', expected: '2025-01-26T23:59:59.999Z' },
        { input: '2025-01-29T00:00:00Z', expected: '2025-02-02T23:59:59.999Z' },
    ].forEach(({ input, expected }) =>
        expect(DateResolver.getEndOfIsoWeek(new Date(input))).toEqual(new Date(expected))
    );
});

test('DateResolver: getStartOfMonth(), Should return the start of the month (UTC)', () => {
    [
        { input: '2025-01-12T13:00:00Z', expected: '2025-01-01T00:00:00Z' },
        { input: '2025-02-01T00:10:01Z', expected: '2025-02-01T00:00:00Z' },
    ].forEach(({ input, expected }) =>
        expect(DateResolver.getStartOfMonth(new Date(input))).toEqual(new Date(expected))
    );
});

test('DateResolver: getEndOfMonth(), Should return the end of the month (UTC)', () => {
    [
        { input: '2025-01-12T13:00:00Z', expected: '2025-01-31T23:59:59.999Z' },
        { input: '2025-02-01T00:10:01Z', expected: '2025-02-28T23:59:59.999Z' },
    ].forEach(({ input, expected }) => expect(DateResolver.getEndOfMonth(new Date(input))).toEqual(new Date(expected)));
});

test('DateResolver: getStartOfYear(), Should return the start of the year (UTC)', () => {
    [
        { input: '2025-05-01T13:00:00Z', expected: '2025-01-01T00:00:00Z' },
        { input: '2025-02-01T00:10:01Z', expected: '2025-01-01T00:00:00Z' },
    ].forEach(({ input, expected }) =>
        expect(DateResolver.getStartOfYear(new Date(input))).toEqual(new Date(expected))
    );
});

test('DateResolver: getEndOfYear(), Should return the end of the year (UTC)', () => {
    [
        { input: '2025-01-12T13:00:00Z', expected: '2025-12-31T23:59:59.999Z' },
        { input: '2025-02-01T00:10:01Z', expected: '2025-12-31T23:59:59.999Z' },
    ].forEach(({ input, expected }) => expect(DateResolver.getEndOfYear(new Date(input))).toEqual(new Date(expected)));
});
