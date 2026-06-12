import { RetryUtilsOptions } from "../options";
export declare function retryUntilDefined<RETURN_TYPE>(fn: () => RETURN_TYPE | undefined | null, retryOptions?: RetryUtilsOptions): Promise<RETURN_TYPE>;
export declare function retryAsyncUntilDefined<RETURN_TYPE>(fn: () => Promise<RETURN_TYPE | undefined | null>, retryOptions?: RetryUtilsOptions): Promise<RETURN_TYPE>;
