export class TooManyTries extends Error {
  constructor() {
    super("function did not complete within allowed number of attempts");
  }
  tooManyTries = true;
}

export function isTooManyTries(error: unknown): error is TooManyTries {
  return (error as TooManyTries).tooManyTries === true;
}
