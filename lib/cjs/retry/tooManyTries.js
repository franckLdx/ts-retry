"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTooManyTries = exports.TooManyTries = void 0;
class TooManyTries extends Error {
    constructor() {
        super("function did not complete within allowed number of attempts");
        this.tooManyTries = true;
    }
}
exports.TooManyTries = TooManyTries;
function isTooManyTries(error) {
    return error.tooManyTries === true;
}
exports.isTooManyTries = isTooManyTries;
