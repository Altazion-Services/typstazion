import { JsonParser, URI } from '../core';
import { NetazionResultResolver } from './NetazionResultResolver';
import type { NetazionSSERequest, NetazionResult, NetazionRequest } from './types';

export interface NetazionApiConfig {
    baseUrl: string;
    log?: 'none' | 'error' | 'info';
}

/**
 * HTTP Client for Rest APIs builded with the Netazion library.
 */
export class NetazionApi {
    public constructor(config: NetazionApiConfig) {
        this.config = { ...this.config, ...config };
    }

    /**
     * The NetazionApi configuration.
     */
    public config: NetazionApiConfig = {
        baseUrl: 'http://localhost:3000',
        log: 'info',
    };

    private eventSources: Record<string, EventSource> = {};

    private resolveUrl = (url: string): string => URI.resolve(this.config.baseUrl, url);

    private resolveHeaders = (request?: NetazionRequest): Record<string, string> => ({
        'Content-Type': 'application/json',
        ...request?.headers,
    });

    /**
     * HTTP Request to a Netazion API endpoint.
     * @param url The endpoint URL.
     * @param config The request configuration.
     * @returns A Promise resolving to a NetazionResult or null in case of a request failure.
     */
    public async request<T>(url: string, config?: NetazionRequest<T>): Promise<NetazionResult<T> | null> {
        try {
            const response = await fetch(this.resolveUrl(url), {
                method: config?.method ?? 'GET',
                headers: this.resolveHeaders(config),
                body: config?.body ? JSON.stringify(config.body) : undefined,
            });
            const result = await NetazionResultResolver.resolveResponse<T>(response);

            if (!response.ok && typeof config?.onError === 'function') {
                await config.onError(result as NetazionResult);
            }
            if (response.ok && typeof config?.onSuccess === 'function') {
                await config.onSuccess(result as NetazionResult<T>);
            }
            if (this.config.log === 'info' || (this.config.log === 'error' && !response.ok)) {
                console.log(`NetazionApi.request() Response: [${response.status}]: ${JSON.stringify(result)}`);
            }

            return result;
        } catch (error) {
            if (this.config.log !== 'none') {
                console.error(`NetazionApi.request(): Failed to fetch ${url}:`, error);
            }
            return null;
        }
    }

    /**
     * Checks if there is an active EventSource connection.
     * @param key Optional key to check a specific EventSource connection.
     * @returns True if connected, false otherwise.
     */
    public isEventSourceConnected = (key?: string): boolean =>
        key ? this.eventSources[key] !== undefined : Object.keys(this.eventSources).length > 0;

    /**
     * Connects to a Server-Sent Events (SSE) endpoint.
     * @param request The SSE request configuration.
     */
    public connectEventSource<T = any>(request: NetazionSSERequest<T>): void {
        const resolvedKey = request.key ?? request.url;

        if (this.eventSources[resolvedKey]) {
            if (this.config.log === 'info') {
                console.log(`NetazionApi.connectEventSource() EventSource already connected for URL: ${request.url}`);
            }
            return;
        }

        const eventSource = new EventSource(this.resolveUrl(request.url));
        this.eventSources[resolvedKey] = eventSource;

        eventSource.onopen = () => {
            if (this.config.log === 'info') {
                console.log(`NetazionApi.connectEventSource() Connected to EventSource: ${resolvedKey}`);
            }
            if (typeof request.onOpen === 'function') {
                request.onOpen();
            }
        };

        eventSource.onmessage = (event: MessageEvent) => {
            if (this.config.log === 'info') {
                console.log(`NetazionApi.connectEventSource() Message received from EventSource: ${resolvedKey}`);
            }
            if (typeof request.onMessage === 'function') {
                const data = JsonParser.safeParse(event.data) as any;
                request.onMessage(NetazionResultResolver.resolveResult<T>(data));
            }
        };

        eventSource.onerror = (error: any) => {
            if (this.config.log !== 'none') {
                console.error(`NetazionApi.connectEventSource() Error from EventSource: ${resolvedKey}`, error);
            }
            if (typeof request.onError === 'function') {
                request.onError(error);
            }
            delete this.eventSources[resolvedKey];
            eventSource.close();
        };
    }

    /**
     * Disconnects from a Server-Sent Events (SSE) endpoint.
     * @param key Optional key to disconnect a specific EventSource connection.
     * If no key is provided, all EventSource connections will be disconnected.
     */
    public disconnectEventSource(key?: string): void {
        if (key) {
            const eventSource = this.eventSources[key];
            if (eventSource) {
                eventSource.close();
                delete this.eventSources[key];
                if (this.config.log === 'info') {
                    console.log(`NetazionApi.disconnectEventSource() Disconnected EventSource: ${key}`);
                }
            } else if (this.config.log !== 'none') {
                console.error(`NetazionApi.disconnectEventSource() No EventSource found for key: ${key}`);
            }
        } else {
            for (const key in this.eventSources) {
                this.disconnectEventSource(key);
            }
        }
    }
}
