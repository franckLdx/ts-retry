import { RetryOptions } from "../options";
import { retry, retryAsync } from "../retry";
import { RetryUtilsOptions } from "./options";

const until = <RETURN_TYPE>(
  lastResult: RETURN_TYPE | undefined | null,
): boolean => lastResult !== undefined && lastResult !== null;

const getOptions = <RETURN_TYPE>(
  retryOptions?: RetryUtilsOptions,
): RetryOptions<RETURN_TYPE | undefined | null> => ({
  ...retryOptions,
  until,
});

export async function retryUntilDefined<
  PARAMS_TYPE extends any[],
  RETURN_TYPE,
>(
  fn: (...args: PARAMS_TYPE) => RETURN_TYPE | undefined | null,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  const options = getOptions<RETURN_TYPE>(retryOptions);
  return (await retry(fn, options))!;
}

export async function retryAsyncUntilDefined<
  PARAMS_TYPE extends any[],
  RETURN_TYPE,
>(
  fn: (...args: PARAMS_TYPE) => Promise<RETURN_TYPE | undefined | null>,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  const options = getOptions<RETURN_TYPE>(retryOptions);
  return (await retryAsync(fn, options))!;
}
