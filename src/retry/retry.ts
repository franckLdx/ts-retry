import { asyncDecorator } from "../misc";
import { wait } from "../wait/wait";
import { RetryOptions } from "./options";
import { getRetryParameters, RetryParameters } from "./parameters";
import { AbortError } from "./utils/erros/abortError";
import { isTooManyTries, TooManyTries } from "./utils/erros/tooManyTries";

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
      if (retryParameters.onSuccessFunc) {
        retryParameters.onSuccessFunc(result, retryParameters.currentTry)
      }
      return result;
    } else if (canRecall) {
      // i.e. throw so that we log via retryParameters.onError below 
      // as !isTooManyTries && canRecall
      throw new Error("function result failed to meet until() requirements")
    } else {
      throw new TooManyTries(result);
    }
  } catch (err) {
    if (!isTooManyTries(err) && canRecall) {
      const canRecall = retryParameters.onError?.(err as Error, retryParameters.currentTry)
      if (canRecall === false) {
        throw new AbortError(err as Error, retryParameters.currentTry)
      }
      return await recall(fn, retryParameters, undefined, err as Error);
    } else {
      if (retryParameters.onMaxRetryFunc) {
        retryParameters.onMaxRetryFunc(err as Error, retryParameters.currentTry)
      }
      throw err;
    }
  }
}

async function recall<RETURN_TYPE>(
  fn: () => Promise<RETURN_TYPE>,
  retryParameters: RetryParameters<RETURN_TYPE>,
  lastResult?: RETURN_TYPE,
  lastError?: Error): Promise<RETURN_TYPE> {
  const delay = retryParameters.delay({
    currentTry: retryParameters.currentTry,
    maxTry: retryParameters.maxTry,
    lastDelay: retryParameters.lastDelay,
    lastResult,
    lastError,
  })
  await wait(delay);
  const newRetryParameters: RetryParameters<RETURN_TYPE> = {
    ...retryParameters,
    currentTry: retryParameters.currentTry + 1
  }
  return await actualRetry(fn, newRetryParameters);
};