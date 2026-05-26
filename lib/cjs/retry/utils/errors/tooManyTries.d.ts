export declare class TooManyTries<RETURN_TYPE> extends Error {
    private lastResult;
    constructor(lastResult?: RETURN_TYPE | undefined);
    tooManyTries: boolean;
    getLastResult(): RETURN_TYPE | undefined;
}
export declare function isTooManyTries(error: unknown): error is TooManyTries<any>;
