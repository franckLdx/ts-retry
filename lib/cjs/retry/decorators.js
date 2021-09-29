"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryDecorator = exports.retryAsyncDecorator = void 0;
const _1 = require(".");
function retryAsyncDecorator(fn, retryOptions) {
    return (...args) => {
        const wrappedFn = () => fn(...args);
        return (0, _1.retryAsync)(wrappedFn, retryOptions);
    };
}
exports.retryAsyncDecorator = retryAsyncDecorator;
function retryDecorator(fn, retryOptions) {
    return (...args) => {
        const wrappedFn = () => fn(...args);
        return (0, _1.retry)(wrappedFn, retryOptions);
    };
}
exports.retryDecorator = retryDecorator;
