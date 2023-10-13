import { retry, retryAsync } from "../../retry";
import {
  retryUntilOptionsToRetryOptionsHof,
  RetryUtilsOptions,
} from "../options";

const until = <RETURN_TYPE>(lastResult: RETURN_TYPE): boolean =>
  // deno-lint-ignore no-explicit-any
  (lastResult as any) == true;

const getOptions = retryUntilOptionsToRetryOptionsHof(until);

export async function retryUntilTruthy<
  RETURN_TYPE,
>(
  fn: () => RETURN_TYPE,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  const options = getOptions<RETURN_TYPE>(retryOptions);
  return await retry(fn, options);
}

export async function retryAsyncUntilTruthy<
  RETURN_TYPE,
>(
  fn: () => Promise<RETURN_TYPE>,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  const options = getOptions<RETURN_TYPE>(retryOptions);
  return await retryAsync(fn, options);
}
