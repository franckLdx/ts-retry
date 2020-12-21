import { waitUntil } from "..";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { isTimeoutError } from "./wait";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("Wait", () => {
  it("wait should return function return code", async () => {
    const duration = 1000;
    const result = Symbol("OK");
    const fn = async () => result;
    const actualResult = await waitUntil(fn, duration);
    actualResult.should.equal(result);
  });

  it("wait should throw function exception", async () => {
    const duration = 1000;
    const errorMsg = "BOOM";
    const fn = () => {
      throw new Error(errorMsg);
    };
    let actualErr = undefined;
    try {
      await waitUntil(fn, duration);
    } catch (err) {
      actualErr = err;
    }
    if (actualErr === undefined) {
      throw new Error("Should have thrown an exception");
    }
    actualErr.message.should.equal(errorMsg);
  });

  it("wait should throw TimeoutError exception", async () => {
    const duration = 1000;
    const fn = () => {
      return new Promise((resolve) =>
        setTimeout(
          () => resolve(1),
          duration * 2,
        )
      );
    };
    let actualErr = undefined;
    try {
      await waitUntil(fn, duration);
    } catch (err) {
      actualErr = err;
    }
    if (actualErr === undefined) {
      throw new Error("Should have thrown an exception");
    }
    actualErr.isTimeout.should.equal(true);
    isTimeoutError(actualErr).should.equal(true);
  });

  it("wait should throw a custom exception", async () => {
    const duration = 1000;
    const errMsg = "Boom";
    const fn = () => {
      return new Promise((resolve) =>
        setTimeout(
          () => resolve(1),
          duration * 2,
        )
      );
    };
    let actualErr = undefined;
    try {
      await waitUntil(fn, duration, new Error(errMsg));
    } catch (err) {
      actualErr = err;
    }
    if (actualErr === undefined) {
      throw new Error("Should have thrown an exception");
    }
    should.not.exist(actualErr.isTimeout);
    isTimeoutError(actualErr).should.equal(false);
    (actualErr).message.should.equal(errMsg);
  });
});
