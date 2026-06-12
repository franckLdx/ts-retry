export declare class AbortError extends Error {
    private error;
    private currentTry;
    constructor(error: Error, currentTry: number);
    abortError: boolean;
    getError(): Error;
    getCurrentTry(): number;
}
export declare function isAbortError(error: unknown): error is AbortError;
