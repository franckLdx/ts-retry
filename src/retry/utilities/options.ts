import { RetryOptions } from "../options";

export type RetryUtilsOptions = Exclude<RetryOptions<void>, "until">;
