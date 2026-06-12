import { RetryUtilsOptions } from "../options";
export declare function retryUntilDefinedDecorator<PARAMETERS_TYPE extends any[], RETURN_TYPE>(fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE | null | undefined, retryOptions?: RetryUtilsOptions): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>;
export declare function retryAsyncUntilDefinedDecorator<PARAMETERS_TYPE extends any[], RETURN_TYPE>(fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE | null | undefined>, retryOptions?: RetryUtilsOptions): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>;
