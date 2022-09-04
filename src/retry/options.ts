export type UNTIL<RETURN_TYPE> = (result: RETURN_TYPE) => boolean;

export type DELAY<RETURN_TYPE> = (parameter: {
  currentTry: number,
  marTry: number,
  lastDelay?: number
  lastResult?: RETURN_TYPE
}) => number;

export interface RetryOptions<RETURN_TYPE = any> {
  maxTry?: number;
  delay?: number;
  until?: UNTIL<RETURN_TYPE> | null;
  onMaxRetryFunc?: (err: Error) => void; // this can be helpful when you want to save some information before throwing TooManyTries error
}

export let defaultRetryOptions: RetryOptions<any> = {
  delay: 250,
  maxTry: 4 * 60,
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
