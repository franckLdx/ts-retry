export declare function wait(duration?: number): Promise<unknown>;
export declare function waitUntil<RETURN_TYPE>(fn: () => RETURN_TYPE, duration?: number, error?: Error): Promise<RETURN_TYPE>;
export declare function waitUntilAsync<RETURN_TYPE>(fn: () => Promise<RETURN_TYPE>, duration?: number, error?: Error): Promise<RETURN_TYPE>;
export declare class TimeoutError extends Error {
    isTimeout: boolean;
}
export declare function isTimeoutError(error: Error): error is TimeoutError;
