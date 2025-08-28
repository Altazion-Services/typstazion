export default class StringTruncator {
    public static truncateOnWhiteSpace(input: string, maxLength = 150): string {
        if (input.length <= maxLength) {
            return input;
        }
        const truncated = input.slice(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        return lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
    }
}
