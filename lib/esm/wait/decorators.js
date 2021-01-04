import { waitUntil, waitUntilAsync } from "./wait";
export function waitUntilAsyncDecorator(fn, duration, error) {
    return (...args) => {
        const wrappedFn = () => fn(...args);
        return waitUntilAsync(wrappedFn, duration, error);
    };
}
/** a waitUntil decorator
 * @param fn the function to execute
 * @param duration timeout in milliseconds
 * @param [error] custom error to throw when fn duration exceeded duration. If not provided a TimeoutError is thrown.
 * @returns: a function hat takes same parameters as fn. It calls fn using waitUntil and returns/throws the results/error of this call?
*/
export function waitUntilDecorator(fn, duration, error) {
    return (...args) => {
        const wrappedFn = () => fn(...args);
        return waitUntil(wrappedFn, duration, error);
    };
}
