import { asyncDecorator } from "../misc";
import { wait } from "../wait/wait";
import { defaultRetryOptions, RetryOptions } from "./options";
import { TooManyTries } from "./tooManyTries";

export async function retry<T>(
  fn: () => T,
  retryOptions?: RetryOptions<T>,
): Promise<T> {
  const fnAsync = asyncDecorator(fn);
  return await retryAsync(fnAsync, retryOptions);
}

export async function retryAsync<T>(
  fn: () => Promise<T>,
  retryOptions?: RetryOptions<T>,
): Promise<T> {
  const { maxTry, delay, until } = { ...defaultRetryOptions, ...retryOptions };
  if (maxTry === undefined || maxTry <= 0) {
    throw new TooManyTries();
  }
  const recall = async () => {
    await wait(delay);
    return await retryAsync(fn, { delay, maxTry: maxTry - 1, until });
  };
  try {
    const result = await fn();
    const done = until ? until(result) : true;
    return done ? result : await recall();
  } catch (err) {
    if (maxTry > 1) {
      return await recall();
    } else {
      throw err;
    }
  }
}
