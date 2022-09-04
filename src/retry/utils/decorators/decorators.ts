import { retry, retryAsync } from "../../retry";
import { RetryOptions } from "../../options";

export function retryAsyncDecorator<
  RETURN_TYPE extends (...args: any[]) => Promise<any>,
>(
  fn: RETURN_TYPE,
  retryOptions?: RetryOptions<ReturnType<RETURN_TYPE>>,
) {
  return (...args: Parameters<RETURN_TYPE>): ReturnType<RETURN_TYPE> => {
    const wrappedFn = () => fn(...args);
    return retryAsync(wrappedFn, retryOptions) as ReturnType<RETURN_TYPE>;
  };
}

export function retryDecorator<
  RETURN_TYPE extends (...args: any[]) => any,
>(
  fn: RETURN_TYPE,
  retryOptions?: RetryOptions<ReturnType<RETURN_TYPE>>,
) {
  return (
    ...args: Parameters<RETURN_TYPE>
  ): Promise<ReturnType<RETURN_TYPE>> => {
    const wrappedFn = () => fn(...args);
    return retry(wrappedFn, retryOptions) as Promise<ReturnType<RETURN_TYPE>>;
  };
}
