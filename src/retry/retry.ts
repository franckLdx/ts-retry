import { asyncDecorator } from "../misc";
import { wait } from "../wait/wait";
import { defaultRetryOptions, RetryOptions } from "./options";

export async function retry<T>(
  fn: () => T,
  retryOptions?: RetryOptions,
): Promise<T> {
  const fnAsync = asyncDecorator(fn);
  return retryAsync(fnAsync, retryOptions);
}

export async function retryAsync<T>(
  fn: () => Promise<T>,
  { maxTry, delay }: RetryOptions = defaultRetryOptions,
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
