import { waitUntil } from "..";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { isTimeoutError } from "./wait";
import { getDefaultDuration, setDefaultDuration } from "./options";
import { setDefaultRetryOptions } from "../retry";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("Wait until", () => {
  const defaultDuration = getDefaultDuration();
  afterEach(function () {
    setDefaultDuration(defaultDuration);
  });

  it("wait should return function return code", async function () {
    const duration = 1000;
    const result = Symbol("OK");
    const fn = async () => result;
    const actualResult = await waitUntil(fn, duration);
    actualResult.should.equal(result);
  });

  it("wait should throw function exception", async function () {
    const duration = 1000;
    const errorMsg = "BOOM";
    const fn = () => {
      throw new Error(errorMsg);
    };
    let actualErr = undefined;
    try {
      await waitUntil(fn, duration);
    } catch (err) {
      actualErr = err as any;
    }
    if (actualErr === undefined) {
      throw new Error("Should have thrown an exception");
    }
    actualErr.message.should.equal(errorMsg);
  });

  it("wait should throw TimeoutError exception", async function () {
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
      actualErr = err as any;
    }
    if (actualErr === undefined) {
      throw new Error("Should have thrown an exception");
    }
    actualErr.isTimeout.should.equal(true);
    isTimeoutError(actualErr).should.equal(true);
  });

  it("wait should throw TimeoutError exception an default timeout expiration", async function () {
    setDefaultDuration(1000);
    this.timeout(getDefaultDuration() * 3);
    const fn = () => {
      return new Promise((resolve) =>
        setTimeout(
          () => resolve(1),
          getDefaultDuration() * 2,
        )
      );
    };
    let actualErr = undefined;
    try {
      await waitUntil(fn);
    } catch (err) {
      actualErr = err as any;
    }
    if (actualErr === undefined) {
      throw new Error("Should have thrown an exception");
    }
    actualErr.isTimeout.should.equal(true);
    isTimeoutError(actualErr).should.equal(true);
  });

  it("wait should throw a custom exception", async function () {
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
      actualErr = err as any;
    }
    if (actualErr === undefined) {
      throw new Error("Should have thrown an exception");
    }
    should.not.exist((actualErr as any).isTimeout);
    isTimeoutError(actualErr).should.equal(false);
    actualErr.message.should.equal(errMsg);
  });
});
