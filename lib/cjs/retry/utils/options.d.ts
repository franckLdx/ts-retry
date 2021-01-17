import { RetryOptions, UNTIL } from "../options";
export declare type RetryUtilsOptions = Exclude<RetryOptions<void>, "until">;
export declare const retryUntilOptionsToRetryOptionsHof: <RETURN_TYPE>(until: UNTIL<RETURN_TYPE>) => (retryOptions?: RetryOptions<void> | undefined) => RetryOptions<RETURN_TYPE>;
