export const retryUntilOptionsToRetryOptionsHof = (until) => (retryOptions) => (Object.assign(Object.assign({}, retryOptions), { until }));
