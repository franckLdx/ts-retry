import { RetryUtilsOptions } from "../options";
export declare function retryUntilTruthyDecorator<PARAMETERS_TYPE extends any[], RETURN_TYPE>(fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE, retryOptions?: RetryUtilsOptions): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>;
export declare function retryAsyncUntilTruthyDecorator<PARAMETERS_TYPE extends any[], RETURN_TYPE>(fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>, retryOptions?: RetryUtilsOptions): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>;
