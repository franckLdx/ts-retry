import { retry, retryAsync } from "../../retry";
import {
  retryUntilOptionsToRetryOptionsHof,
  RetryUtilsOptions,
} from "../options";

const until = <RETURN_TYPE>(
  lastResult: RETURN_TYPE | undefined | null,
): boolean => lastResult !== undefined && lastResult !== null;

const getOptions = retryUntilOptionsToRetryOptionsHof(until);

export async function retryUntilDefined<
  RETURN_TYPE,
>(
  fn: () => RETURN_TYPE | undefined | null,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  const options = getOptions<RETURN_TYPE>(retryOptions);
  return (await retry(fn, options))!;
}

export async function retryAsyncUntilDefined<
  RETURN_TYPE,
>(
  fn: () => Promise<RETURN_TYPE | undefined | null>,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  const options = getOptions<RETURN_TYPE>(retryOptions);
  return (await retryAsync(fn, options))!;
}
