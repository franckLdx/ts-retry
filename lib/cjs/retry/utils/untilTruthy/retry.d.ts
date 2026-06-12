import { RetryUtilsOptions } from "../options";
export declare function retryUntilTruthy<RETURN_TYPE>(fn: () => RETURN_TYPE, retryOptions?: RetryUtilsOptions): Promise<RETURN_TYPE>;
export declare function retryAsyncUntilTruthy<RETURN_TYPE>(fn: () => Promise<RETURN_TYPE>, retryOptions?: RetryUtilsOptions): Promise<RETURN_TYPE>;
