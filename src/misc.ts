export const asyncDecorator = <T>(fn: () => T) =>
  () =>
    new Promise<T>((resolve, reject) => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    });
