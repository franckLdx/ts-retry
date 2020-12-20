import { retry, retryAsync, RetryOptions } from ".";

export function retryAsyncDecorator<
  T extends (...args: any[]) => Promise<any>,
>(
  fn: T,
  retryOptions?: RetryOptions,
) {
  return (...args: Parameters<T>): ReturnType<T> => {
    const wrappedFn = () => fn(...args);
    return retryAsync(wrappedFn, retryOptions) as ReturnType<T>;
  };
}

export function retryDecorator<
  T extends (...args: any[]) => any,
>(
  fn: T,
  retryOptions?: RetryOptions,
) {
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const wrappedFn = () => fn(...args);
    return retry(wrappedFn, retryOptions) as Promise<ReturnType<T>>;
  };
}
