export declare function wait(duration: number): Promise<unknown>;
export declare function waitUntil<T>(fn: () => T, delay: number, error?: Error): Promise<T>;
export declare function waitUntilAsync<T>(fn: () => Promise<T>, delay: number, error?: Error): Promise<T>;
export declare class TimeoutError extends Error {
    isTimeout: boolean;
}
