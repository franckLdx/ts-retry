"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultRetryOptions = exports.setDefaultRetryOptions = exports.defaultRetryOptions = void 0;
exports.defaultRetryOptions = {
    delay: 250,
    maxTry: 4 * 60,
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
