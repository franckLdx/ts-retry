export declare const asyncDecorator: <T>(fn: () => T) => () => Promise<T>;
export declare const assertDefined: <T>(value: T | null | undefined, errMsg: string) => value is T;
