import { RetryUtilsOptions } from "./options";
export declare function retryUntilDefined<PARAMS_TYPE extends any[], RETURN_TYPE>(fn: (...args: PARAMS_TYPE) => RETURN_TYPE | undefined | null, retryOptions?: RetryUtilsOptions): Promise<RETURN_TYPE>;
export declare function retryAsyncUntilDefined<PARAMS_TYPE extends any[], RETURN_TYPE>(fn: (...args: PARAMS_TYPE) => Promise<RETURN_TYPE | undefined | null>, retryOptions?: RetryUtilsOptions): Promise<RETURN_TYPE>;
