"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbortError = void 0;
exports.isAbortError = isAbortError;
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
