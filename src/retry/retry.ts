import { asyncDecorator } from "../misc";
import { wait } from "../wait/wait";
import { RetryOptions } from "./options";
import { getRetryParameters, RetryParameters } from "./parameters";
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
  const retryParameters = getRetryParameters(1, retryOptions)
  return await actualRetry(fn, retryParameters);
}

async function actualRetry<RETURN_TYPE>(
  fn: () => Promise<RETURN_TYPE>,
  retryParameters: RetryParameters<RETURN_TYPE>): Promise<RETURN_TYPE> {
  const canRecall = retryParameters.currentTry < retryParameters.maxTry;
  try {
    const result = await fn();
    if (retryParameters.until(result)) {
      return result;
    } else if (canRecall) {
      return await recall(fn, retryParameters, result);
    } else {
      throw new TooManyTries();
    }
  } catch (err) {
    if (!isTooManyTries(err) && canRecall) {
      return await recall(fn, retryParameters);
    } else {
      if (retryParameters.onMaxRetryFunc !== undefined) {
        retryParameters.onMaxRetryFunc(err as Error)
      }
      throw err;
    }
  }
}

async function recall<RETURN_TYPE>(
  fn: () => Promise<RETURN_TYPE>,
  retryParameters: RetryParameters<RETURN_TYPE>,
  lastResult?: RETURN_TYPE): Promise<RETURN_TYPE> {
  const delay = retryParameters.delay({
    currentTry: retryParameters.currentTry,
    maxTry: retryParameters.maxTry,
    lastDelay: retryParameters.lastDelay,
    lastResult
  })
  await wait(delay);
  const newRetryParameters: RetryParameters<RETURN_TYPE> = {
    ...retryParameters,
    currentTry: retryParameters.currentTry + 1
  }
  return await actualRetry(fn, newRetryParameters);
};