"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRetryParameters = void 0;
const options_1 = require("./options");
function getRetryParameters(currentTry, retryOptions) {
    const fullOptions = Object.assign(Object.assign({}, (0, options_1.getDefaultRetryOptions)()), retryOptions);
    return Object.assign(Object.assign({}, fullOptions), { currentTry, maxTry: fullOptions.maxTry || 4 * 250, delay: getDelay(fullOptions.delay), until: fullOptions.until ? fullOptions.until : () => true });
}
exports.getRetryParameters = getRetryParameters;
function getDelay(delay) {
    if (delay === undefined) {
        return () => 250;
    }
    if (typeof delay === 'function') {
        return delay;
    }
    return () => delay;
}
