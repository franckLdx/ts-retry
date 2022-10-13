export class TooManyTries extends Error {
    constructor(lastResult = undefined) {
        super("function did not complete within allowed number of attempts");
        this.lastResult = lastResult;
        this.tooManyTries = true;
    }
    getLastResult() {
        return this.lastResult;
    }
}
export function isTooManyTries(error) {
    return error.tooManyTries === true;
}
