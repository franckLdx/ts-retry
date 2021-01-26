import { RetryUtilsOptions } from "../options";
import { retryAsyncUntilResponse } from "./retry";

export function retryAsyncUntilResponseDecorator<
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE extends { ok: boolean },
>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>,
  retryOptions?: RetryUtilsOptions,
) {
  return async (...args: PARAMETERS_TYPE): Promise<RETURN_TYPE> => {
    const wrappedFn = async () => await fn(...args);
    return await retryAsyncUntilResponse(wrappedFn, retryOptions);
  };
}
