export declare const asyncDecorator: <T>(fn: () => T) => () => Promise<T>;
export declare const assertDefined: <T>(value: T | undefined | null, errMsg: string) => value is T;
