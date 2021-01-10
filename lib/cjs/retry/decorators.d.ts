import { RetryOptions } from ".";
export declare function retryAsyncDecorator<T extends (...args: any[]) => Promise<any>>(fn: T, retryOptions?: RetryOptions<ReturnType<T>>): (...args: Parameters<T>) => ReturnType<T>;
export declare function retryDecorator<T extends (...args: any[]) => any>(fn: T, retryOptions?: RetryOptions<ReturnType<T>>): (...args: Parameters<T>) => Promise<ReturnType<T>>;
