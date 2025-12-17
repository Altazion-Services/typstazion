import { JsonParser } from '../core';
import type { NetazionResult } from './types';

export class NetazionResultResolver {
    /**
     * Default result structure used to validate and construct Netazion API responses.
     */
    public static defaultResult: NetazionResult = {
        value: undefined,
        errors: [],
        infos: [],
    };

    /**
     * Default error structure used when no error information is available and an unhandled error
     * occurs in the Netazion API.
     */
    public static defaultError = {
        value: undefined,
        errors: [
            {
                code: '0',
                reference: 'UNHANDLED_ERROR',
                message: 'The API encountered an unhandled error with no additional information.',
                stackTrace: undefined,
            },
        ],
        infos: [],
    };

    /**
     * Resolves the given response into a NetazionResult structure.
     * @param obj The response to resolve.
     * @returns A NetazionResult object.
     */
    public static resolveResult<T = any>(obj: T): NetazionResult<T> {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return { ...this.defaultResult, value: obj as T };
        }

        return Object.keys(this.defaultResult).every(k => k in obj)
            ? (obj as object as NetazionResult<T>)
            : { ...this.defaultResult, value: obj as T };
    }

    /**
     * Resolves a Response object into a NetazionResult structure.
     * @param response The Response to resolve.
     * @returns A NetazionResult object.
     */
    public static async resolveResponse<T = any>(response: Response): Promise<NetazionResult<T>> {
        const data = (await JsonParser.safeResponseParse(response)) as T;
        return this.resolveResult<T>(data);
    }
}
