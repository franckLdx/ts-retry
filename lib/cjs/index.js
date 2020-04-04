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
function retry(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const wrapped = () => new Promise((resolve, reject) => {
            try {
                resolve(fn());
            }
            catch (err) {
                reject(err);
            }
        });
        return retryAsync(wrapped, retryOptions);
    });
}
exports.retry = retry;
function retryAsync(fn, { maxTry, delay }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn();
        }
        catch (err) {
            if (maxTry > 1) {
                yield wait(delay);
                return yield retryAsync(fn, { delay, maxTry: maxTry - 1 });
            }
            throw err;
        }
    });
}
exports.retryAsync = retryAsync;
function wait(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}
exports.wait = wait;
