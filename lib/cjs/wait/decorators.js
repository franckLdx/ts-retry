"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitUntilDecorator = exports.waitUntilAsyncDecorator = void 0;
const wait_1 = require("./wait");
function waitUntilAsyncDecorator(fn, duration, error) {
    return (...args) => {
        const wrappedFn = () => fn(...args);
        return (0, wait_1.waitUntilAsync)(wrappedFn, duration, error);
    };
}
exports.waitUntilAsyncDecorator = waitUntilAsyncDecorator;
/** a waitUntil decorator
 * @param fn the function to execute
 * @param duration timeout in milliseconds
 * @param [error] custom error to throw when fn duration exceeded duration. If not provided a TimeoutError is thrown.
 * @returns: a function hat takes same parameters as fn. It calls fn using waitUntil and returns/throws the results/error of this call?
*/
function waitUntilDecorator(fn, duration, error) {
    return (...args) => {
        const wrappedFn = () => fn(...args);
        return (0, wait_1.waitUntil)(wrappedFn, duration, error);
    };
}
exports.waitUntilDecorator = waitUntilDecorator;
