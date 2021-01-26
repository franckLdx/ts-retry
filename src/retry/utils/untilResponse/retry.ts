import { retryAsyncHof } from "../hof";
import { OK_TYPE } from "./type";

const until = <RETURN_TYPE extends OK_TYPE>(
  lastResult: RETURN_TYPE,
): boolean => lastResult.ok;

export const retryAsyncUntilResponse = retryAsyncHof(until);
