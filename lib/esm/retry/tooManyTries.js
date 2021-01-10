export class TooManyTries extends Error {
    constructor() {
        super("function did not complete within allowed number of attempts");
        this.tooManyTries = true;
    }
}
export function isTooManyTries(error) {
    return error.tooManyTries === true;
}
