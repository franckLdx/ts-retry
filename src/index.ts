export interface RetryOptions {
  maxTry: number;
  delay: number;
}

export async function retry<T>(
  fn: () => T,
  retryOptions: RetryOptions,
): Promise<T> {
  const wrapped = () =>
    new Promise<T>((resolve, reject) => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    });
  return retryAsync(wrapped, retryOptions);
}

export async function retryAsync<T>(
  fn: () => Promise<T>,
  { maxTry, delay }: RetryOptions,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (maxTry > 1) {
      await wait(delay);
      return await retryAsync(fn, { delay, maxTry: maxTry - 1 });
    }
    throw err;
  }
}

export function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function waitUntil<T>(
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
