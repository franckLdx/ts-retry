
export class AbortError extends Error {
  constructor(private error: Error, private currentTry: number) {
    super("function call aborted due to an error");
  }
  abortError = true;

  public getError(): Error {
    return this.error;
  }

  public getCurrentTry(): number {
    return this.currentTry
  }
}

export function isAbortError(error: unknown): error is AbortError {
  return (error as AbortError).abortError === true;
}
