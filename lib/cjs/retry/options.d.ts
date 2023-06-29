export type UNTIL<RETURN_TYPE> = (result: RETURN_TYPE) => boolean;
export interface DelayParameters<RETURN_TYPE> {
    currentTry: number;
    maxTry: number;
    lastDelay?: number;
    lastResult?: RETURN_TYPE;
}
export type DELAY<RETURN_TYPE> = (parameter: DelayParameters<RETURN_TYPE>) => number;
export interface RetryOptions<RETURN_TYPE = any> {
    maxTry?: number;
    delay?: number | DELAY<RETURN_TYPE>;
    until?: UNTIL<RETURN_TYPE> | null;
    onError?: (err: Error) => void;
    onMaxRetryFunc?: (err: Error) => void;
}
export declare const defaultDelay = 250;
export declare const defaultMaxTry: number;
export declare let defaultRetryOptions: RetryOptions<any>;
export declare function setDefaultRetryOptions<RETURN_TYPE>(retryOptions: RetryOptions<RETURN_TYPE>): RetryOptions<RETURN_TYPE>;
export declare function getDefaultRetryOptions<RETURN_TYPE = any>(): Readonly<RetryOptions<RETURN_TYPE>>;
