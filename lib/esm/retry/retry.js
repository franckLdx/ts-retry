var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { asyncDecorator } from "../misc";
import { wait } from "../wait/wait";
import { getRetryParameters } from "./parameters";
import { AbortError } from "./utils/errors/abortError";
import { isTooManyTries, TooManyTries } from "./utils/errors/tooManyTries";
export function retry(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const fnAsync = asyncDecorator(fn);
        return yield retryAsync(fnAsync, retryOptions);
    });
}
export function retryAsync(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const retryParameters = getRetryParameters(1, retryOptions);
        return yield actualRetry(fn, retryParameters);
    });
}
function actualRetry(fn, retryParameters) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const canRecall = retryParameters.currentTry < retryParameters.maxTry;
        try {
            const result = yield fn();
            if (retryParameters.until(result)) {
                if (retryParameters.onSuccessFunc) {
                    retryParameters.onSuccessFunc(result, retryParameters.currentTry);
                }
                return result;
            }
            else if (canRecall) {
                // i.e. throw so that we log via retryParameters.onError below 
                // as !isTooManyTries && canRecall
                throw new Error("function result failed to meet until() requirements");
            }
            else {
                throw new TooManyTries(result);
            }
        }
        catch (err) {
            if (!isTooManyTries(err) && canRecall) {
                const canRecall = (_a = retryParameters.onError) === null || _a === void 0 ? void 0 : _a.call(retryParameters, err, retryParameters.currentTry);
                if (canRecall === false) {
                    throw new AbortError(err, retryParameters.currentTry);
                }
                return yield recall(fn, retryParameters, undefined, err);
            }
            else {
                if (retryParameters.onMaxRetryFunc) {
                    retryParameters.onMaxRetryFunc(err, retryParameters.currentTry);
                }
                throw err;
            }
        }
    });
}
function recall(fn, retryParameters, lastResult, lastError) {
    return __awaiter(this, void 0, void 0, function* () {
        const delay = retryParameters.delay({
            currentTry: retryParameters.currentTry,
            maxTry: retryParameters.maxTry,
            lastDelay: retryParameters.lastDelay,
            lastResult,
            lastError,
        });
        yield wait(delay);
        const newRetryParameters = Object.assign(Object.assign({}, retryParameters), { currentTry: retryParameters.currentTry + 1 });
        return yield actualRetry(fn, newRetryParameters);
    });
}
;
