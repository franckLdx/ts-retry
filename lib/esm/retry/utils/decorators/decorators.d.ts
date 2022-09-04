import { RetryOptions } from "../../options";
export declare function retryAsyncDecorator<RETURN_TYPE extends (...args: any[]) => Promise<any>>(fn: RETURN_TYPE, retryOptions?: RetryOptions<ReturnType<RETURN_TYPE>>): (...args: Parameters<RETURN_TYPE>) => ReturnType<RETURN_TYPE>;
export declare function retryDecorator<RETURN_TYPE extends (...args: any[]) => any>(fn: RETURN_TYPE, retryOptions?: RetryOptions<ReturnType<RETURN_TYPE>>): (...args: Parameters<RETURN_TYPE>) => Promise<ReturnType<RETURN_TYPE>>;
