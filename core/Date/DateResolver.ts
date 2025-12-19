/**
 * Global date resolver utility.
 */
export class DateResolver {
    /**
     * Returns the start of the hour (UTC) for the given date.
     * @param date The date to resolve. Defaults to now.
     * @returns The start of the hour.
     */
    public static getStartOfHour(date = new Date()) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours()));
    }

    /**
     * Returns the end of the hour (UTC) for the given date.
     * @param date The date to resolve. Defaults to now.
     * @returns The end of the hour.
     */
    public static getEndOfHour(date = new Date()) {
        const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours()));
        d.setUTCMinutes(59, 59, 999);
        return new Date(d);
    }

    /**
     * Returns the start of the day (UTC) for the given date.
     * @param date The date to resolve. Defaults to now.
     * @returns The start of the day.
     */
    public static getStartOfDay(date = new Date()) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }

    /**
     * Returns the end of the day (UTC) for the given date.
     * @param date The date to resolve. Defaults to now.
     * @returns The end of the day.
     */
    public static getEndOfDay(date = new Date()) {
        const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        d.setUTCHours(23, 59, 59, 999);
        return new Date(d);
    }

    /**
     * Returns the first day (UTC) of the ISO week for the given date.
     * @param date The date to resolve. Defaults to now.
     * @returns The first day of the ISO week.
     */
    public static getStartOfIsoWeek(date = new Date()) {
        const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        const day = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() - day + 1);
        return new Date(d);
    }

    /**
     * Returns the last day (UTC) of the ISO week for the given date.
     * @param date The date to resolve. Defaults to now.
     * @returns The last day of the ISO week.
     */
    public static getEndOfIsoWeek(date = new Date()) {
        const d = this.getStartOfIsoWeek(date);
        d.setUTCDate(d.getUTCDate() + 6);
        d.setUTCHours(23, 59, 59, 999);
        return new Date(d);
    }

    /**
     * Returns the first day (UTC) of the month for the given date.
     * @param date The date to resolve. Defaults to now.
     * @returns The first day of the month.
     */
    public static getStartOfMonth(date = new Date()) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    }

    /**
     * Returns the last day (UTC) of the month for the given date.
     * @param date The date to resolve. Defaults to now.
     * @returns The last day of the month.
     */
    public static getEndOfMonth(date = new Date()) {
        const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
        d.setUTCHours(23, 59, 59, 999);
        return new Date(d);
    }

    /**
     * Returns the last day (UTC) of the year for the given date.
     * @param date The date to resolve. Defaults to now.
     * @returns The last day of the year.
     */
    public static getEndOfYear(date = new Date()) {
        const d = new Date(Date.UTC(date.getUTCFullYear(), 11, 31));
        d.setUTCHours(23, 59, 59, 999);
        return new Date(d);
    }

    /**
     * Returns the first day (UTC) of the year for the given date.
     * @param date The date to resolve. Defaults to now.
     * @returns The first day of the year.
     */
    public static getStartOfYear(date = new Date()) {
        return new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    }
}
