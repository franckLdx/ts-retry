type UNTIL<RETURN_TYPE> = (result: RETURN_TYPE) => boolean;
interface DelayParameters<RETURN_TYPE> {
    currentTry: number;
    maxTry: number;
    lastDelay?: number;
    lastResult?: RETURN_TYPE;
}
type DELAY<RETURN_TYPE> = (parameter: DelayParameters<RETURN_TYPE>) => number;
interface RetryOptions<RETURN_TYPE = any> {
    maxTry?: number;
    delay?: number | DELAY<RETURN_TYPE>;
    until?: UNTIL<RETURN_TYPE> | null;
    onError?: (err: Error) => void;
    onMaxRetryFunc?: (err: Error) => void;
}
declare function setDefaultRetryOptions<RETURN_TYPE>(retryOptions: RetryOptions<RETURN_TYPE>): RetryOptions<RETURN_TYPE>;
declare function getDefaultRetryOptions<RETURN_TYPE = any>(): Readonly<RetryOptions<RETURN_TYPE>>;

declare function retry<RETURN_TYPE>(fn: () => RETURN_TYPE, retryOptions?: RetryOptions<RETURN_TYPE>): Promise<RETURN_TYPE>;
declare function retryAsync<RETURN_TYPE>(fn: () => Promise<RETURN_TYPE>, retryOptions?: RetryOptions<RETURN_TYPE>): Promise<RETURN_TYPE>;

declare class TooManyTries<RETURN_TYPE> extends Error {
    private lastResult;
    constructor(lastResult?: RETURN_TYPE | undefined);
    tooManyTries: boolean;
    getLastResult(): RETURN_TYPE | undefined;
}
declare function isTooManyTries(error: unknown): error is TooManyTries<any>;

type RetryUtilsOptions = Exclude<RetryOptions<any>, "until">;

declare function retryUntilDefined<RETURN_TYPE>(fn: () => RETURN_TYPE | undefined | null, retryOptions?: RetryUtilsOptions): Promise<RETURN_TYPE>;
declare function retryAsyncUntilDefined<RETURN_TYPE>(fn: () => Promise<RETURN_TYPE | undefined | null>, retryOptions?: RetryUtilsOptions): Promise<RETURN_TYPE>;

declare function retryAsyncUntilDefinedDecorator<PARAMETERS_TYPE extends any[], RETURN_TYPE>(fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE | null | undefined>, retryOptions?: RetryUtilsOptions): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>;

declare function retryUntilTruthy<RETURN_TYPE>(fn: () => RETURN_TYPE, retryOptions?: RetryUtilsOptions): Promise<RETURN_TYPE>;
declare function retryAsyncUntilTruthy<RETURN_TYPE>(fn: () => Promise<RETURN_TYPE>, retryOptions?: RetryUtilsOptions): Promise<RETURN_TYPE>;

declare function retryUntilTruthyDecorator<PARAMETERS_TYPE extends any[], RETURN_TYPE>(fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE, retryOptions?: RetryUtilsOptions): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>;
declare function retryAsyncUntilTruthyDecorator<PARAMETERS_TYPE extends any[], RETURN_TYPE>(fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>, retryOptions?: RetryUtilsOptions): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>;

type RESPONSE_TYPE = {
    ok: boolean;
};

declare function retryAsyncUntilResponse<RETURN_TYPE extends RESPONSE_TYPE>(fn: () => Promise<RETURN_TYPE>, retryOptions?: RetryUtilsOptions): Promise<RETURN_TYPE>;

declare function retryAsyncUntilResponseDecorator<PARAMETERS_TYPE extends any[], RETURN_TYPE extends RESPONSE_TYPE>(fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>, retryOptions?: RetryUtilsOptions): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>;

declare function createExponetialDelay<RETURN_TYPE>(initialDelay: number): DELAY<RETURN_TYPE>;
declare function createMutiplicableDelay<RETURN_TYPE>(initialDelay: number, multiplicator: number): DELAY<RETURN_TYPE>;
declare function createRandomDelay<RETURN_TYPE>(min: number, max: number): DELAY<RETURN_TYPE>;

declare function wait(duration?: number): Promise<unknown>;
declare function waitUntil<RETURN_TYPE>(fn: () => RETURN_TYPE, duration?: number, error?: Error): Promise<RETURN_TYPE>;
declare function waitUntilAsync<RETURN_TYPE>(fn: () => Promise<RETURN_TYPE>, duration?: number, error?: Error): Promise<RETURN_TYPE>;
declare class TimeoutError extends Error {
    isTimeout: boolean;
}
declare function isTimeoutError(error: Error): error is TimeoutError;

declare function setDefaultDuration(duration: number): void;
declare function getDefaultDuration(): number;

export { type RetryOptions, TimeoutError, TooManyTries, createExponetialDelay, createMutiplicableDelay, createRandomDelay, getDefaultDuration, getDefaultRetryOptions, isTimeoutError, isTooManyTries, retry, retryAsync, retryAsyncUntilDefined, retryAsyncUntilDefinedDecorator, retryAsyncUntilResponse, retryAsyncUntilResponseDecorator, retryAsyncUntilTruthy, retryAsyncUntilTruthyDecorator, retryUntilDefined, retryUntilTruthy, retryUntilTruthyDecorator, setDefaultDuration, setDefaultRetryOptions, wait, waitUntil, waitUntilAsync };
