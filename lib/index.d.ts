export interface RetryOptions {
    maxTry: number;
    delay: number;
}
export declare function retry<T>(fn: () => T, retryOptions: RetryOptions): Promise<{}>;
export declare function retryAsync<T>(fn: () => Promise<T>, { maxTry, delay }: RetryOptions): Promise<T>;
