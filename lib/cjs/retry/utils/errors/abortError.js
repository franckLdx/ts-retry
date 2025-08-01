"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAbortError = exports.AbortError = void 0;
class AbortError extends Error {
    constructor(error, currentTry) {
        super("function call aborted due to an error");
        this.error = error;
        this.currentTry = currentTry;
        this.abortError = true;
    }
    getError() {
        return this.error;
    }
    getCurrentTry() {
        return this.currentTry;
    }
}
exports.AbortError = AbortError;
function isAbortError(error) {
    return error.abortError === true;
}
exports.isAbortError = isAbortError;
