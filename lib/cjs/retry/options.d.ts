export interface RetryOptions<T = any> {
    maxTry?: number;
    delay?: number;
    until?: ((result: T) => boolean) | null;
}
export declare let defaultRetryOptions: RetryOptions<any>;
export declare function setDefaultRetryOptions<T>(retryOptions: RetryOptions<T>): RetryOptions<T>;
export declare function getDefaultRetryOptions<T = any>(): Readonly<RetryOptions<T>>;
