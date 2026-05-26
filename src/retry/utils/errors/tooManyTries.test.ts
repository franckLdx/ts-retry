import { isTooManyTries, TooManyTries } from "./tooManyTries";

describe("TooManyTries", function () {
  it("Should return false when error is not a ToManyTries", function () {
    const error = new Error("BOOM");
    isTooManyTries(error).should.false;
  });
  it("Should return true when error is a ToManyTries", function () {
    const error = new TooManyTries();
    isTooManyTries(error).should.true;
  });
});
