export default class StringTruncator {
    /**
     * Truncates a string to the nearest whitespace before the maxLength.
     * If the string is shorter than maxLength, it is returned as is.
     * If no whitespace is found, it truncates at maxLength.
     * @param input The string to truncate.
     * @param maxLength The maximum length of the string.
     * @returns The truncated string.
     */
    public static truncateOnWhiteSpace(input: string, maxLength = 150): string {
        if (input.length <= maxLength) {
            return input;
        }
        const truncated = input.slice(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        return lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
    }

    /**
     * Removes the leading slash from a string if it exists.
     * @param str The string to process.
     * @returns The string without a leading slash.
     */
    public static removeLeadingSlash = (str: string) => str.replace(/^\//, '');

    /**
     * Ensure the string starts with one slash.
     * @param str The string to process.
     * @returns The string with a leading slash.
     */
    public static ensureLeadingSlash = (str: string) => '/' + str.replace(/^\/+/, '');
}
