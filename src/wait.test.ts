import { waitUntil, waitUntilAsync } from "./wait";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("Wait", () => {
  it("wait should return function return code", async () => {
    const delay = 1000;
    const result = Symbol("OK");
    const fn = async () => result;
    const actualResult = await waitUntil(fn, delay);
    actualResult.should.equal(result);
  });

  it("wait should throw function exception", async () => {
    const delay = 1000;
    const errorMsg = "BOOM";
    const fn = () => {
      throw new Error(errorMsg);
    };
    let actualErr = undefined;
    try {
      await waitUntil(fn, delay);
    } catch (err) {
      actualErr = err;
    }
    if (actualErr === undefined) {
      throw new Error("Should have thrown an exception");
    }
    actualErr.message.should.equal(errorMsg);
  });

  it("wait should throw TimeoutError exception", async () => {
    const delay = 1000;
    const fn = () => {
      return new Promise((resolve) =>
        setTimeout(
          () => resolve(1),
          delay * 2,
        )
      );
    };
    let actualErr = undefined;
    try {
      await waitUntil(fn, delay);
    } catch (err) {
      actualErr = err;
    }
    if (actualErr === undefined) {
      throw new Error("Should have thrown an exception");
    }
    actualErr.isTimeout.should.equal(true);
  });

  it("wait should throw a custom exception", async () => {
    const delay = 1000;
    const errMsg = "Boom";
    const fn = () => {
      return new Promise((resolve) =>
        setTimeout(
          () => resolve(1),
          delay * 2,
        )
      );
    };
    let actualErr = undefined;
    try {
      await waitUntil(fn, delay, new Error(errMsg));
    } catch (err) {
      actualErr = err;
    }
    if (actualErr === undefined) {
      throw new Error("Should have thrown an exception");
    }
    should.not.exist(actualErr.isTimeout);
    (actualErr).message.should.equal(errMsg);
  });
});
