import { URI } from '../URI';

export default class StringCss {
    public static prefixRelativeUrls(str: string, prefix: string): string {
        return str.replace(/url\((['"]?)(.*?)\1\)/gi, (_, quote, url) =>
            /^(https?:|\/\/|data:)/i.test(url)
                ? `url(${quote}${url}${quote})`
                : `url(${quote}${URI.resolve(prefix, url)}${quote})`
        );
    }
}
