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
import { isTooManyTries, TooManyTries } from "./tooManyTries";
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
                throw new TooManyTries(result);
            }
        }
        catch (err) {
            if (!isTooManyTries(err) && canRecall) {
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
        yield wait(delay);
        const newRetryParameters = Object.assign(Object.assign({}, retryParameters), { currentTry: retryParameters.currentTry + 1 });
        return yield actualRetry(fn, newRetryParameters);
    });
}
;
