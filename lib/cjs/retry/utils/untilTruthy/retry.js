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
exports.retryAsyncUntilTruthy = exports.retryUntilTruthy = void 0;
const __1 = require("../..");
const options_1 = require("../options");
const until = (lastResult) => 
// deno-lint-ignore no-explicit-any
lastResult == true;
const getOptions = (0, options_1.retryUntilOptionsToRetryOptionsHof)(until);
function retryUntilTruthy(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getOptions(retryOptions);
        return yield (0, __1.retry)(fn, options);
    });
}
exports.retryUntilTruthy = retryUntilTruthy;
function retryAsyncUntilTruthy(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getOptions(retryOptions);
        return yield (0, __1.retryAsync)(fn, options);
    });
}
exports.retryAsyncUntilTruthy = retryAsyncUntilTruthy;
