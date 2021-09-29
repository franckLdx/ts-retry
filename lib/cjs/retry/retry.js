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
exports.retryAsync = exports.retry = void 0;
const misc_1 = require("../misc");
const wait_1 = require("../wait/wait");
const options_1 = require("./options");
const tooManyTries_1 = require("./tooManyTries");
function retry(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const fnAsync = (0, misc_1.asyncDecorator)(fn);
        return yield retryAsync(fnAsync, retryOptions);
    });
}
exports.retry = retry;
function retryAsync(fn, retryOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const { maxTry, delay, until } = Object.assign(Object.assign({}, (0, options_1.getDefaultRetryOptions)()), retryOptions);
        (0, misc_1.assertDefined)(maxTry, `maxTry must be defined`);
        (0, misc_1.assertDefined)(delay, `delay must be defined`);
        const canRecall = () => maxTry > 1;
        const recall = () => __awaiter(this, void 0, void 0, function* () {
            yield (0, wait_1.wait)(delay);
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
                throw new tooManyTries_1.TooManyTries();
            }
        }
        catch (err) {
            if (!(0, tooManyTries_1.isTooManyTries)(err) && canRecall()) {
                return yield recall();
            }
            else {
                throw err;
            }
        }
    });
}
exports.retryAsync = retryAsync;
