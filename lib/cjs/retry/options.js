"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultRetryOptions = exports.setDefaultRetryOptions = exports.defaultRetryOptions = exports.defaultMaxTry = exports.defaultDelay = void 0;
exports.defaultDelay = 250;
exports.defaultMaxTry = 4 * 60;
exports.defaultRetryOptions = {
    delay: exports.defaultDelay,
    maxTry: exports.defaultMaxTry,
    until: null,
};
function setDefaultRetryOptions(retryOptions) {
    exports.defaultRetryOptions = Object.assign(Object.assign({}, exports.defaultRetryOptions), retryOptions);
    return getDefaultRetryOptions();
}
exports.setDefaultRetryOptions = setDefaultRetryOptions;
function getDefaultRetryOptions() {
    return Object.assign({}, exports.defaultRetryOptions);
}
exports.getDefaultRetryOptions = getDefaultRetryOptions;
