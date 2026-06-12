import { RetryOptions } from "./options";
export declare function retry<RETURN_TYPE>(fn: () => RETURN_TYPE, retryOptions?: RetryOptions<RETURN_TYPE>): Promise<RETURN_TYPE>;
export declare function retryAsync<RETURN_TYPE>(fn: () => Promise<RETURN_TYPE>, retryOptions?: RetryOptions<RETURN_TYPE>): Promise<RETURN_TYPE>;
