import type { NetazionResult } from "./NetazionResult";

export type NetazionOnSuccessCallback<T> = (data: NetazionResult<T>) => void;
export type NetazionOnErrorCallback = (error: NetazionResult) => void;