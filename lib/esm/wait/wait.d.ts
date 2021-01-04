export declare function wait(duration?: number): Promise<unknown>;
export declare function waitUntil<T>(fn: () => T, duration?: number, error?: Error): Promise<T>;
export declare function waitUntilAsync<T>(fn: () => Promise<T>, duration?: number, error?: Error): Promise<T>;
export declare class TimeoutError extends Error {
    isTimeout: boolean;
}
export declare function isTimeoutError(error: Error): error is TimeoutError;
