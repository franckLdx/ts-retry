import { asyncDecorator } from "./misc";
import { wait } from "./wait";

export interface RetryOptions {
  maxTry: number;
  delay: number;
}

export async function retry<T>(
  fn: () => T,
  retryOptions?: RetryOptions,
): Promise<T> {
  const fnAsync = asyncDecorator(fn);
  return retryAsync(fnAsync, retryOptions);
}

export async function retryAsync<T>(
  fn: () => Promise<T>,
  { maxTry, delay }: RetryOptions = defaulRetryOptions,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (maxTry > 1) {
      await wait(delay);
      return await retryAsync(fn, { delay, maxTry: maxTry - 1 });
    }
    throw err;
  }
}

let defaulRetryOptions: RetryOptions = {
  delay: 250,
  maxTry: 250 * 4 * 60,
};

export function setDefaulRetryOptions(
  retryOptions: Partial<RetryOptions>,
): RetryOptions {
  defaulRetryOptions = { ...defaulRetryOptions, ...retryOptions };
  return getDefaulRetryOptions();
}

export function getDefaulRetryOptions(): Readonly<RetryOptions> {
  return { ...defaulRetryOptions };
}
