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
  RETURN_TYPE,
>(
  fn: () => RETURN_TYPE | undefined | null,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  const options = getOptions<RETURN_TYPE>(retryOptions);
  return (await retry(fn, options))!;
}

export function retryUntilDefinedDecorator<
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE,
>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE | null | undefined,
  retryOptions?: RetryUtilsOptions,
) {
  return async (...args: PARAMETERS_TYPE): Promise<RETURN_TYPE> => {
    const wrappedFn = () => fn(...args);
    return await retryUntilDefined(wrappedFn, retryOptions);
  };
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
