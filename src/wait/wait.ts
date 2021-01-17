import { asyncDecorator } from "../misc";
import { defaultDuration } from "./options";

export function wait(duration: number = defaultDuration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function waitUntil<RETURN_TYPE>(
  fn: () => RETURN_TYPE,
  duration?: number,
  error?: Error,
): Promise<RETURN_TYPE> {
  const fnAsync = asyncDecorator(fn);
  return await waitUntilAsync(fnAsync, duration, error);
}

export async function waitUntilAsync<RETURN_TYPE>(
  fn: () => Promise<RETURN_TYPE>,
  duration: number = defaultDuration,
  error: Error = new TimeoutError(
    "function did not complete within allowed time",
  ),
): Promise<RETURN_TYPE> {
  const canary = Symbol("DELAY_EXPIRED");
  const result = await Promise.race([
    fn(),
    timeout(duration, canary),
  ]);
  if (result === canary) {
    throw error;
  }
  return result as RETURN_TYPE;
}

const timeout = async <RETURN_TYPE>(duration: number, result: RETURN_TYPE) => {
  await wait(duration);
  return result;
};

export class TimeoutError extends Error {
  isTimeout = true;
}

export function isTimeoutError(error: Error): error is TimeoutError {
  return (error as TimeoutError).isTimeout === true;
}
