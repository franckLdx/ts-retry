import { RetryUtilsOptions } from "../options";
import { RESPONSE_TYPE } from "./type";
export declare function retryAsyncUntilResponseDecorator<PARAMETERS_TYPE extends any[], RETURN_TYPE extends RESPONSE_TYPE>(fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>, retryOptions?: RetryUtilsOptions): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>;
