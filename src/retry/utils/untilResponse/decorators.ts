import { RetryUtilsOptions } from "../options";
import { retryAsyncUntilResponse } from "./retry";
import { RESPONSE_TYPE } from "./type";

export function retryAsyncUntilResponseDecorator<
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE extends RESPONSE_TYPE,
>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>,
  retryOptions?: RetryUtilsOptions,
) {
  return async (...args: PARAMETERS_TYPE): Promise<RETURN_TYPE> => {
    const wrappedFn = async () => await fn(...args);
    return await retryAsyncUntilResponse(wrappedFn, retryOptions);
  };
}
