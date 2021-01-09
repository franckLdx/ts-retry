export interface RetryOptions<T = any> {
  maxTry?: number;
  delay?: number;
  until?: ((result: T) => boolean) | null;
}

export let defaultRetryOptions: RetryOptions<any> = {
  delay: 250,
  maxTry: 4 * 60,
  until: null,
};

export function setDefaultRetryOptions<T>(
  retryOptions: RetryOptions<T>,
): RetryOptions<T> {
  defaultRetryOptions = { ...defaultRetryOptions, ...retryOptions };
  return getDefaultRetryOptions<T>();
}

export function getDefaultRetryOptions<T = any>(): Readonly<RetryOptions<T>> {
  return { ...defaultRetryOptions };
}
