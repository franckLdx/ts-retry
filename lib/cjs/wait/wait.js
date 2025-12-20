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
exports.TimeoutError = void 0;
exports.wait = wait;
exports.waitUntil = waitUntil;
exports.waitUntilAsync = waitUntilAsync;
exports.isTimeoutError = isTimeoutError;
const misc_1 = require("../misc");
const options_1 = require("./options");
function wait(duration = options_1.defaultDuration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}
function waitUntil(fn, duration, error) {
    return __awaiter(this, void 0, void 0, function* () {
        const fnAsync = (0, misc_1.asyncDecorator)(fn);
        return yield waitUntilAsync(fnAsync, duration, error);
    });
}
function waitUntilAsync(fn_1) {
    return __awaiter(this, arguments, void 0, function* (fn, duration = options_1.defaultDuration, error = new TimeoutError("function did not complete within allowed time")) {
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
class TimeoutError extends Error {
    constructor() {
        super(...arguments);
        this.isTimeout = true;
    }
}
exports.TimeoutError = TimeoutError;
function isTimeoutError(error) {
    return error.isTimeout === true;
}
