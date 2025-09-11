import { expect, test } from 'vitest';
import StringCss from './StringCss';

test('StringCss.prefixRelativeUrls(), Should replace relative URL with the provided prefix', () => {
    const input = `
    background: 
        url('images/truc.png') no-repeat,
        url("/images/abs.png"),
        url('data:image/svg+xml;base64,PHSuperLongString==') no-repeat,
        url(https://france.com/exist.png);`;
    const result = StringCss.prefixRelativeUrls(input, 'https://alsace.com');

    expect(result).toBe(`
    background: 
        url('https://alsace.com/images/truc.png') no-repeat,
        url("https://alsace.com/images/abs.png"),
        url('data:image/svg+xml;base64,PHSuperLongString==') no-repeat,
        url(https://france.com/exist.png);`);
});
