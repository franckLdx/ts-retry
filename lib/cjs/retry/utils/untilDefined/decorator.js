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
exports.retryAsyncUntilDefinedDecorator = exports.retryUntilDefinedDecorator = void 0;
const retry_1 = require("./retry");
function retryUntilDefinedDecorator(fn, retryOptions) {
    return (...args) => __awaiter(this, void 0, void 0, function* () {
        const wrappedFn = () => fn(...args);
        return yield (0, retry_1.retryUntilDefined)(wrappedFn, retryOptions);
    });
}
exports.retryUntilDefinedDecorator = retryUntilDefinedDecorator;
function retryAsyncUntilDefinedDecorator(fn, retryOptions) {
    return (...args) => __awaiter(this, void 0, void 0, function* () {
        const wrappedFn = () => __awaiter(this, void 0, void 0, function* () { return yield fn(...args); });
        return yield (0, retry_1.retryAsyncUntilDefined)(wrappedFn, retryOptions);
    });
}
exports.retryAsyncUntilDefinedDecorator = retryAsyncUntilDefinedDecorator;
