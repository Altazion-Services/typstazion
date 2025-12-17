import type { NetazionMessage } from "./NetazionMessage"

export interface NetazionResult<T = any> {
    value: T;
    errors: NetazionMessage[]
    infos: NetazionMessage[]
}