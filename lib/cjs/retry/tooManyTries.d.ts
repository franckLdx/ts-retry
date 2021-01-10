export declare class TooManyTries extends Error {
    constructor();
    tooManyTries: boolean;
}
export declare function isTooManyTries(error: Error): error is TooManyTries;
