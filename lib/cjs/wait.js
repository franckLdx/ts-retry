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
exports.TimeoutError = exports.waitUntil = exports.wait = void 0;
function wait(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}
exports.wait = wait;
function waitUntil(fn, delay, error = new TimeoutError("function did not complete within allowed time")) {
    return __awaiter(this, void 0, void 0, function* () {
        const canary = Symbol("DELAY_EXPIRED");
        const timeout = () => __awaiter(this, void 0, void 0, function* () {
            yield wait(delay);
            return canary;
        });
        const result = yield Promise.race([
            fn(),
            timeout(),
        ]);
        if (result === canary) {
            throw error;
        }
        return result;
    });
}
exports.waitUntil = waitUntil;
class TimeoutError extends Error {
    constructor() {
        super(...arguments);
        this.isTimeout = true;
    }
}
exports.TimeoutError = TimeoutError;
