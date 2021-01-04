export const asyncDecorator = (fn) => () => new Promise((resolve, reject) => {
    try {
        resolve(fn());
    }
    catch (err) {
        reject(err);
    }
});
