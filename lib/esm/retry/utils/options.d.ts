import { RetryOptions, UNTIL } from "../options";
export type RetryUtilsOptions = Exclude<RetryOptions<any>, "until">;
export declare const retryUntilOptionsToRetryOptionsHof: <RETURN_TYPE>(until: UNTIL<RETURN_TYPE>) => (retryOptions?: RetryUtilsOptions) => RetryOptions<RETURN_TYPE>;
