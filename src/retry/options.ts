export type UNTIL<RETURN_TYPE> = (result: RETURN_TYPE) => boolean;

export interface RetryOptions<RETURN_TYPE = any> {
  maxTry?: number;
  delay?: number;
  until?: UNTIL<RETURN_TYPE> | null;
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
