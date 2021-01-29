import { RetryUtilsOptions } from "../options";
import { RESPONSE_TYPE } from "./type";
export declare function retryAsyncUntilResponse<RETURN_TYPE extends RESPONSE_TYPE>(fn: () => Promise<RETURN_TYPE>, retryOptions?: RetryUtilsOptions): Promise<RETURN_TYPE>;
