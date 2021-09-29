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
exports.isTimeoutError = exports.TimeoutError = exports.waitUntilAsync = exports.waitUntil = exports.wait = void 0;
const misc_1 = require("../misc");
const options_1 = require("./options");
function wait(duration = options_1.defaultDuration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}
exports.wait = wait;
function waitUntil(fn, duration, error) {
    return __awaiter(this, void 0, void 0, function* () {
        const fnAsync = (0, misc_1.asyncDecorator)(fn);
        return yield waitUntilAsync(fnAsync, duration, error);
    });
}
exports.waitUntil = waitUntil;
function waitUntilAsync(fn, duration = options_1.defaultDuration, error = new TimeoutError("function did not complete within allowed time")) {
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
exports.waitUntilAsync = waitUntilAsync;
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
exports.isTimeoutError = isTimeoutError;
