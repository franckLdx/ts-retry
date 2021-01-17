var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assertDefined, asyncDecorator } from "../misc";
import { wait } from "../wait/wait";
import { getDefaultRetryOptions } from "./options";
import { isTooManyTries, TooManyTries } from "./tooManyTries";
export function retry(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const fnAsync = asyncDecorator(fn);
        return yield retryAsync(fnAsync, retryOptions);
    });
}
export function retryAsync(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const { maxTry, delay, until } = Object.assign(Object.assign({}, getDefaultRetryOptions()), retryOptions);
        assertDefined(maxTry, `maxTry must be defined`);
        assertDefined(delay, `delay must be defined`);
        const canRecall = () => maxTry > 1;
        const recall = () => __awaiter(this, void 0, void 0, function* () {
            yield wait(delay);
            return yield retryAsync(fn, { delay, maxTry: maxTry - 1, until });
        });
        try {
            const result = yield fn();
            const done = until ? until(result) : true;
            if (done) {
                return result;
            }
            else if (canRecall()) {
                return yield recall();
            }
            else {
                throw new TooManyTries();
            }
        }
        catch (err) {
            if (!isTooManyTries(err) && canRecall()) {
                return yield recall();
            }
            else {
                throw err;
            }
        }
    });
}
