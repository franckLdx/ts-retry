export interface RetryOptions {
  maxTry: number;
  delay: number;
}

export let defaultRetryOptions: RetryOptions = {
  delay: 250,
  maxTry: 4 * 60,
};

export function setDefaultRetryOptions(
  retryOptions: Partial<RetryOptions>,
): RetryOptions {
  defaultRetryOptions = { ...defaultRetryOptions, ...retryOptions };
  return getDefaultRetryOptions();
}

export function getDefaultRetryOptions(): Readonly<RetryOptions> {
  return { ...defaultRetryOptions };
}
