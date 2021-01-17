"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryUntilOptionsToRetryOptionsHof = void 0;
const retryUntilOptionsToRetryOptionsHof = (until) => (retryOptions) => (Object.assign(Object.assign({}, retryOptions), { until }));
exports.retryUntilOptionsToRetryOptionsHof = retryUntilOptionsToRetryOptionsHof;
