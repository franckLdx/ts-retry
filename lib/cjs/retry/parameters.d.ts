import { DELAY, RetryOptions, UNTIL } from "./options";
export interface RetryParameters<RETURN_TYPE> {
    currentTry: number;
    maxTry: number;
    lastDelay?: number;
    delay: DELAY<RETURN_TYPE>;
    until: UNTIL<RETURN_TYPE>;
    onMaxRetryFunc?: (err: Error, currentTry: number) => void;
    onSuccessFunc?: (result: RETURN_TYPE, currentTry: number) => void;
    onError?: (err: Error, currentTry: number) => boolean | undefined;
}
export declare function getRetryParameters<RETURN_TYPE>(currentTry: number, retryOptions?: RetryOptions<RETURN_TYPE>): Readonly<RetryParameters<RETURN_TYPE>>;
