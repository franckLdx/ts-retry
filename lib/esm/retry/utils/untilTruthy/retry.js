var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { retry, retryAsync } from "../..";
import { retryUntilOptionsToRetryOptionsHof, } from "../options";
const until = (lastResult) => 
// deno-lint-ignore no-explicit-any
lastResult == true;
const getOptions = retryUntilOptionsToRetryOptionsHof(until);
export function retryUntilTruthy(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getOptions(retryOptions);
        return yield retry(fn, options);
    });
}
export function retryAsyncUntilTruthy(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getOptions(retryOptions);
        return yield retryAsync(fn, options);
    });
}
