import { AbortError, isAbortError } from "./abortError";

describe("Abort error", function () {
  it("Should return false when error is not an AbortError", function () {
    const error = new Error("BOOM");
    isAbortError(error).should.false;
  });

  it("Should return true when error is an AbortError", function () {
    const origninalError = new Error("BOOM");
    const currentTry = 3
    const abortError = new AbortError(origninalError, currentTry);
    isAbortError(abortError).should.true;
    (abortError.getError() as Error).should.be.equal(origninalError);
    abortError.getCurrentTry().should.be.equal(currentTry);
  });
});
