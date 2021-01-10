import { assertDefined, asyncDecorator } from "../misc";
import { wait } from "../wait/wait";
import {
  defaultRetryOptions,
  getDefaultRetryOptions,
  RetryOptions,
} from "./options";
import { isTooManyTries, TooManyTries } from "./tooManyTries";

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
  const { maxTry, delay, until } = {
    ...getDefaultRetryOptions(),
    ...retryOptions,
  };
  assertDefined(maxTry, `maxTry must be defined`);
  assertDefined(delay, `delay must be defined`);
  const canRecall = () => maxTry! > 1;
  const recall = async () => {
    await wait(delay);
    return await retryAsync(fn, { delay, maxTry: maxTry! - 1, until });
  };
  try {
    const result = await fn();
    const done = until ? until(result) : true;
    if (done) {
      return result;
    } else if (canRecall()) {
      return await recall();
    } else {
      throw new TooManyTries();
    }
  } catch (err) {
    if (!isTooManyTries(err) && canRecall()) {
      return await recall();
    } else {
      throw err;
    }
  }
}
