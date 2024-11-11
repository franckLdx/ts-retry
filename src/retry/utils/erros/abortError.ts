
export class AbortError extends Error {
  constructor(private error: Error) {
    super("function call aborted due to an error");
  }
  abortError = true;

  public getError(): Error {
    return this.error;
  }
}

export function isAbortError(error: unknown): error is AbortError {
  return (error as AbortError).abortError === true;
}
