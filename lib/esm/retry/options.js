export const defaultDelay = 250;
export const defaultMaxTry = 4 * 60;
export let defaultRetryOptions = {
    delay: defaultDelay,
    maxTry: defaultMaxTry,
    until: null,
};
export function setDefaultRetryOptions(retryOptions) {
    defaultRetryOptions = Object.assign(Object.assign({}, defaultRetryOptions), retryOptions);
    return getDefaultRetryOptions();
}
export function getDefaultRetryOptions() {
    return Object.assign({}, defaultRetryOptions);
}
