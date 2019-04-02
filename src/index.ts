export interface RetryOptions {
  maxTry: number;
  delay: number;
}

export async function retry<T>(fn: () => T, retryOptions: RetryOptions) {
  const wrapped = () => new Promise((resolve, reject) => {
    try {
      resolve(fn());
    } catch (err) {
      reject(err);
    }
  });
  return retryAsync(wrapped, retryOptions);
}

export async function retryAsync<T>(fn: () => Promise<T>, { maxTry, delay }: RetryOptions): Promise<T> {
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

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}