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
import { defaultDuration } from "./options";
export function wait(duration = defaultDuration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}
export function waitUntil(fn, duration, error) {
    return __awaiter(this, void 0, void 0, function* () {
        const fnAsync = asyncDecorator(fn);
        return yield waitUntilAsync(fnAsync, duration, error);
    });
}
export function waitUntilAsync(fn, duration = defaultDuration, error = new TimeoutError("function did not complete within allowed time")) {
    return __awaiter(this, void 0, void 0, function* () {
        const canary = Symbol("DELAY_EXPIRED");
        const result = yield Promise.race([
            fn(),
            timeout(duration, canary),
        ]);
        if (result === canary) {
            throw error;
        }
        return result;
    });
}
const timeout = (duration, result) => __awaiter(void 0, void 0, void 0, function* () {
    yield wait(duration);
    return result;
});
export class TimeoutError extends Error {
    constructor() {
        super(...arguments);
        this.isTimeout = true;
    }
}
export function isTimeoutError(error) {
    return error.isTimeout === true;
}
