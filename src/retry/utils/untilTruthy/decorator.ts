import { RetryUtilsOptions } from "../options";
import { retryAsyncUntilTruthy, retryUntilTruthy } from "./retry";

export function retryUntilTruthyDecorator<
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE,
>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE,
  retryOptions?: RetryUtilsOptions,
) {
  return async (...args: PARAMETERS_TYPE): Promise<RETURN_TYPE> => {
    const wrappedFn = () => fn(...args);
    return await retryUntilTruthy(wrappedFn, retryOptions);
  };
}

export function retryAsyncUntilTruthyDecorator<
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE,
>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>,
  retryOptions?: RetryUtilsOptions,
) {
  return async (...args: PARAMETERS_TYPE): Promise<RETURN_TYPE> => {
    const wrappedFn = async () => await fn(...args);
    return await retryAsyncUntilTruthy(wrappedFn, retryOptions);
  };
}
