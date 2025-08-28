import { expect, test } from 'vitest';
import StringSanitizer from './StringSanitizer';

test('StringSanitizer.toReadableText(), Should remove HTML tags from a string', () => {
    expect(StringSanitizer.toReadableText('<p>Hello world!</p>')).toBe('Hello world!');
    expect(StringSanitizer.toReadableText('<div>Test</div>')).toBe('Test');
    expect(StringSanitizer.toReadableText('<span>Another test</span>')).toBe('Another test');
});
