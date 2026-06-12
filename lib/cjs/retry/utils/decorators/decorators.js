"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryAsyncDecorator = retryAsyncDecorator;
exports.retryDecorator = retryDecorator;
const retry_1 = require("../../retry");
function retryAsyncDecorator(fn, retryOptions) {
    return (...args) => {
        const wrappedFn = () => fn(...args);
        return (0, retry_1.retryAsync)(wrappedFn, retryOptions);
    };
}
function retryDecorator(fn, retryOptions) {
    return (...args) => {
        const wrappedFn = () => fn(...args);
        return (0, retry_1.retry)(wrappedFn, retryOptions);
    };
}
