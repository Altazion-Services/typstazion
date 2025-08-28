import { expect, test } from 'vitest';
import StringTruncator from './StringTruncator';

test('StringTruncator.truncateOnWhiteSpace(), Should truncate text to a maximum length on white space when possible', () => {
    expect(StringTruncator.truncateOnWhiteSpace('Hello world!', 8)).toBe('Hello');
    expect(StringTruncator.truncateOnWhiteSpace('Hello world!', 20)).toBe('Hello world!');
    expect(StringTruncator.truncateOnWhiteSpace('Hello world!', 2)).toBe('He');
});
