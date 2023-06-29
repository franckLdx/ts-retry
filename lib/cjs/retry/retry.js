"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryAsync = exports.retry = void 0;
const misc_1 = require("../misc");
const wait_1 = require("../wait/wait");
const parameters_1 = require("./parameters");
const tooManyTries_1 = require("./tooManyTries");
function retry(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const fnAsync = (0, misc_1.asyncDecorator)(fn);
        return yield retryAsync(fnAsync, retryOptions);
    });
}
exports.retry = retry;
function retryAsync(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const retryParameters = (0, parameters_1.getRetryParameters)(1, retryOptions);
        return yield actualRetry(fn, retryParameters);
    });
}
exports.retryAsync = retryAsync;
function actualRetry(fn, retryParameters) {
    return __awaiter(this, void 0, void 0, function* () {
        const canRecall = retryParameters.currentTry < retryParameters.maxTry;
        try {
            const result = yield fn();
            if (retryParameters.until(result)) {
                return result;
            }
            else if (canRecall) {
                return yield recall(fn, retryParameters, result);
            }
            else {
                throw new tooManyTries_1.TooManyTries(result);
            }
        }
        catch (err) {
            if (!(0, tooManyTries_1.isTooManyTries)(err) && canRecall) {
                if (retryParameters.onError) {
                    retryParameters.onError(err);
                }
                return yield recall(fn, retryParameters);
            }
            else {
                if (retryParameters.onMaxRetryFunc) {
                    retryParameters.onMaxRetryFunc(err);
                }
                throw err;
            }
        }
    });
}
function recall(fn, retryParameters, lastResult) {
    return __awaiter(this, void 0, void 0, function* () {
        const delay = retryParameters.delay({
            currentTry: retryParameters.currentTry,
            maxTry: retryParameters.maxTry,
            lastDelay: retryParameters.lastDelay,
            lastResult
        });
        yield (0, wait_1.wait)(delay);
        const newRetryParameters = Object.assign(Object.assign({}, retryParameters), { currentTry: retryParameters.currentTry + 1 });
        return yield actualRetry(fn, newRetryParameters);
    });
}
;
