export const asyncDecorator = <T>(fn: () => T) =>
  () =>
    new Promise<T>((resolve, reject) => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    });

export const assertDefined = <T>(
  value: T | undefined | null,
  errMsg: string,
): value is T => {
  if (value === undefined || value == null) {
    throw new Error(errMsg);
  }
  return true;
};
