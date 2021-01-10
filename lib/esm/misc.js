export const asyncDecorator = (fn) => () => new Promise((resolve, reject) => {
    try {
        resolve(fn());
    }
    catch (err) {
        reject(err);
    }
});
export const assertDefined = (value, errMsg) => {
    if (value === undefined || value == null) {
        throw new Error(errMsg);
    }
    return true;
};
