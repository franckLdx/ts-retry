export class TooManyTries<RETURN_TYPE> extends Error {
  constructor(private lastResult: RETURN_TYPE | undefined = undefined) {
    super("function did not complete within allowed number of attempts");
  }
  tooManyTries = true;

  public getLastResult(): RETURN_TYPE | undefined {
    return this.lastResult;
  }
}

export function isTooManyTries(error: unknown): error is TooManyTries<any> {
  return (error as TooManyTries<any>).tooManyTries === true;
}
