import type { NetazionOnErrorCallback, NetazionOnSuccessCallback } from './NetazionCallback';

export interface NetazionRequest<T = any> {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: Record<string, any>;
    onSuccess?: NetazionOnSuccessCallback<T> | Promise<NetazionOnSuccessCallback<T>>;
    onError?: NetazionOnErrorCallback | Promise<NetazionOnErrorCallback>;
}
