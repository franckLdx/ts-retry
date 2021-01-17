export declare type UNTIL<RETURN_TYPE> = (result: RETURN_TYPE) => boolean;
export interface RetryOptions<RETURN_TYPE = any> {
    maxTry?: number;
    delay?: number;
    until?: UNTIL<RETURN_TYPE> | null;
}
export declare let defaultRetryOptions: RetryOptions<any>;
export declare function setDefaultRetryOptions<RETURN_TYPE>(retryOptions: RetryOptions<RETURN_TYPE>): RetryOptions<RETURN_TYPE>;
export declare function getDefaultRetryOptions<RETURN_TYPE = any>(): Readonly<RetryOptions<RETURN_TYPE>>;
