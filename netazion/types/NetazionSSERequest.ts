import type { NetazionResult } from './NetazionResult';

export interface NetazionSSERequest<T = any> {
    url: string;
    key?: string;
    onOpen?: () => void;
    onMessage?: (data: NetazionResult<T>) => void;
    onError?: (error: any) => void;
}
