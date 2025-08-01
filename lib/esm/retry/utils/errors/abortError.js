export class AbortError extends Error {
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
export function isAbortError(error) {
    return error.abortError === true;
}
