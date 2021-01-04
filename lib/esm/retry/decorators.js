import { retry, retryAsync } from ".";
export function retryAsyncDecorator(fn, retryOptions) {
    return (...args) => {
        const wrappedFn = () => fn(...args);
        return retryAsync(wrappedFn, retryOptions);
    };
}
export function retryDecorator(fn, retryOptions) {
    return (...args) => {
        const wrappedFn = () => fn(...args);
        return retry(wrappedFn, retryOptions);
    };
}
