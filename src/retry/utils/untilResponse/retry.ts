import { retry, retryAsync } from "../../retry";
import {
  retryUntilOptionsToRetryOptionsHof,
  RetryUtilsOptions,
} from "../options";
import { RESPONSE_TYPE } from "./type";

const until = <RETURN_TYPE extends RESPONSE_TYPE>(
  lastResult: RETURN_TYPE,
): boolean => lastResult.ok;

const getOptions = retryUntilOptionsToRetryOptionsHof(until);

export async function retryAsyncUntilResponse<
  RETURN_TYPE extends RESPONSE_TYPE,
>(
  fn: () => Promise<RETURN_TYPE>,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  const options = getOptions<RETURN_TYPE>(retryOptions);
  return await retryAsync(fn, options);
}
