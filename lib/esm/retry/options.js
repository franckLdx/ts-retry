export let defaultRetryOptions = {
    delay: 250,
    maxTry: 4 * 60,
};
export function setDefaultRetryOptions(retryOptions) {
    defaultRetryOptions = Object.assign(Object.assign({}, defaultRetryOptions), retryOptions);
    return getDefaultRetryOptions();
}
export function getDefaultRetryOptions() {
    return Object.assign({}, defaultRetryOptions);
}
