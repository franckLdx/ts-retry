import { asyncDecorator } from "../misc";
import { defaultDuration } from "./options";

export function wait(duration: number = defaultDuration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function waitUntil<T>(
  fn: () => T,
  duration?: number,
  error?: Error,
): Promise<T> {
  const fnAsync = asyncDecorator(fn);
  return await waitUntilAsync(fnAsync, duration, error);
}

export async function waitUntilAsync<T>(
  fn: () => Promise<T>,
  duration: number = defaultDuration,
  error: Error = new TimeoutError(
    "function did not complete within allowed time",
  ),
): Promise<T> {
  const canary = Symbol("DELAY_EXPIRED");
  const result = await Promise.race([
    fn(),
    timeout(duration, canary),
  ]);
  if (result === canary) {
    throw error;
  }
  return result as T;
}

const timeout = async <T>(duration: number, result: T) => {
  await wait(duration);
  return result;
};

export class TimeoutError extends Error {
  isTimeout = true;
}

export function isTimeoutError(error: Error): error is TimeoutError {
  return (error as TimeoutError).isTimeout === true;
}
