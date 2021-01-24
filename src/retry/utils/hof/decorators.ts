import { RetryUtilsOptions } from "../options";

export const retryAsyncUntiDecoratorHof = <
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE,
>(
  retryAsyncFn: (
    fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>,
    retryOptions?: RetryUtilsOptions,
  ) => any,
) => {
  return function decorator(
    fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>,
    retryOptions?: RetryUtilsOptions,
  ) {
    return async function decorated(
      ...args: PARAMETERS_TYPE
    ): Promise<RETURN_TYPE> {
      const wrappedFn = async () => await fn(...args);
      return await retryAsyncFn(wrappedFn, retryOptions);
    };
  };
};
