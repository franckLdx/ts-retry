import { asyncDecorator } from "../misc";

export function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function waitUntil<T>(
  fn: () => T,
  delay: number,
  error?: Error,
): Promise<T> {
  const fnAsync = asyncDecorator(fn);
  return await waitUntilAsync(fnAsync, delay, error);
}

export async function waitUntilAsync<T>(
  fn: () => Promise<T>,
  delay: number,
  error: Error = new TimeoutError(
    "function did not complete within allowed time",
  ),
): Promise<T> {
  const canary = Symbol("DELAY_EXPIRED");
  const timeout = async () => {
    await wait(delay);
    return canary;
  };
  const result = await Promise.race([
    fn(),
    timeout(),
  ]);
  if (result === canary) {
    throw error;
  }
  return result as T;
}

export class TimeoutError extends Error {
  isTimeout = true;
}
