import { defaultDelay, defaultMaxTry, getDefaultRetryOptions } from "./options";
export function getRetryParameters(currentTry, retryOptions) {
    const fullOptions = Object.assign(Object.assign({}, getDefaultRetryOptions()), retryOptions);
    return Object.assign(Object.assign({}, fullOptions), { currentTry, maxTry: fullOptions.maxTry || defaultMaxTry, delay: getDelay(fullOptions.delay), until: fullOptions.until ? fullOptions.until : () => true });
}
function getDelay(delay) {
    if (delay === undefined) {
        return () => defaultDelay;
    }
    if (typeof delay === 'function') {
        return delay;
    }
    return () => delay;
}
