import { RetryOptions } from "./options";
export declare function retry<T>(fn: () => T, retryOptions?: RetryOptions<T>): Promise<T>;
export declare function retryAsync<T>(fn: () => Promise<T>, retryOptions?: RetryOptions<T>): Promise<T>;
