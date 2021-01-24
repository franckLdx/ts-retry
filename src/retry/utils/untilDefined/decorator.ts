import { RetryUtilsOptions } from "../options";
import { retryAsyncUntilDefined, retryUntilDefined } from "./retry";

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

export function retryAsyncUntilDefinedDecorator<
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE,
>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE | null | undefined>,
  retryOptions?: RetryUtilsOptions,
) {
  return async (...args: PARAMETERS_TYPE): Promise<RETURN_TYPE> => {
    const wrappedFn = async () => await fn(...args);
    return await retryAsyncUntilDefined(wrappedFn, retryOptions);
  };
}
