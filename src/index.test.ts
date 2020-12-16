import * as sinon from "sinon";
import { retry, RetryOptions, waitUntil } from ".";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("Retry", () => {
  it("cb works the first time, retry should not re-call it", async () => {
    const callback = sinon.stub();
    await retry(callback, { delay: 10, maxTry: 10 });
    callback.should.have.been.calledOnce;
  });
  it("work after three times, retry should call it while cb throws exception", async () => {
    const callback = sinon.stub();
    callback.onFirstCall().throws("BOOM");
    callback.onSecondCall().throws("BOOM");
    await retry(callback, { delay: 10, maxTry: 10 });
    callback.should.have.been.calledThrice;
  });
  it('always failed, retry should give up after "maxTry"', async () => {
    const callback = sinon.stub();
    callback.throws("BOOM");
    const options: RetryOptions = { delay: 3, maxTry: 100 };
    try {
      await retry(callback, options);
    } catch (err) {}
    callback.should.have.been.callCount(options.maxTry);
  });
});

describe("WaitUntil", () => {
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
    const fn = async () => {
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
    const fn = async () => {
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
    const fn = async () => {
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
