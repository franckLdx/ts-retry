export type UNTIL<RETURN_TYPE> = (result: RETURN_TYPE) => boolean;

export interface DelayParameters<RETURN_TYPE> {
  currentTry: number,
  maxTry: number,
  lastDelay?: number,
  lastResult?: RETURN_TYPE,
  lastError?: Error
}

export type DELAY<RETURN_TYPE> = (parameter: DelayParameters<RETURN_TYPE>) => number;

export interface RetryOptions<RETURN_TYPE = any> {
  maxTry?: number;
  delay?: number | DELAY<RETURN_TYPE>;
  until?: UNTIL<RETURN_TYPE> | null;
  onError?: (err: Error, currentTry: number) => boolean | undefined; // called on each error except the last one. To catch/log the last error use onMaxRetryFunc
  onMaxRetryFunc?: (err: Error, currentTry: number) => void; // this can be helpful when you want to save some information before throwing TooManyTries error
  onSuccessFunc?: (result: RETURN_TYPE, currentTry: number) => void; // called on success. Useful for logging when returning the result.
}

export const defaultDelay = 250;
export const defaultMaxTry = 4 * 60;

export let defaultRetryOptions: RetryOptions<any> = {
  delay: defaultDelay,
  maxTry: defaultMaxTry,
  until: null,
};

export function setDefaultRetryOptions<RETURN_TYPE>(
  retryOptions: RetryOptions<RETURN_TYPE>,
): RetryOptions<RETURN_TYPE> {
  defaultRetryOptions = { ...defaultRetryOptions, ...retryOptions };
  return getDefaultRetryOptions<RETURN_TYPE>();
}

export function getDefaultRetryOptions<RETURN_TYPE = any>(): Readonly<
  RetryOptions<RETURN_TYPE>
> {
  return { ...defaultRetryOptions };
}
