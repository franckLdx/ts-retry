import { assertDefined, asyncDecorator } from "../misc";
import { wait } from "../wait/wait";
import { getDefaultRetryOptions, RetryOptions } from "./options";
import { isTooManyTries, TooManyTries } from "./tooManyTries";

export async function retry<RETURN_TYPE>(
  fn: () => RETURN_TYPE,
  retryOptions?: RetryOptions<RETURN_TYPE>,
): Promise<RETURN_TYPE> {
  const fnAsync = asyncDecorator(fn);
  return await retryAsync(fnAsync, retryOptions);
}

export async function retryAsync<RETURN_TYPE>(
  fn: () => Promise<RETURN_TYPE>,
  retryOptions?: RetryOptions<RETURN_TYPE>,
): Promise<RETURN_TYPE> {
  const { maxTry, delay, until, onMaxRetryFunc } = {
    ...getDefaultRetryOptions(),
    ...retryOptions,
  };
  assertDefined(maxTry, `maxTry must be defined`);
  assertDefined(delay, `delay must be defined`);
  const canRecall = () => maxTry! > 1;
  const recall = async () => {
    await wait(delay);
    return await retryAsync(fn, { delay, maxTry: maxTry! - 1, until, onMaxRetryFunc });
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
      if (onMaxRetryFunc !== undefined) {
        onMaxRetryFunc(err as Error)
      }
      throw err;
    }
  }
}
