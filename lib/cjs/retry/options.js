"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRetryOptions = exports.defaultMaxTry = exports.defaultDelay = void 0;
exports.setDefaultRetryOptions = setDefaultRetryOptions;
exports.getDefaultRetryOptions = getDefaultRetryOptions;
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
function getDefaultRetryOptions() {
    return Object.assign({}, exports.defaultRetryOptions);
}
