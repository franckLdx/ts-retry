export interface RetryOptions {
    maxTry: number;
    delay: number;
}
export declare let defaultRetryOptions: RetryOptions;
export declare function setDefaultRetryOptions(retryOptions: Partial<RetryOptions>): RetryOptions;
export declare function getDefaultRetryOptions(): Readonly<RetryOptions>;
