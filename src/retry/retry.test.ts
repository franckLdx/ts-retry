import * as sinon from "sinon";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { getDefaultRetryOptions, RetryOptions, setDefaultRetryOptions } from './options'
import { retry } from './retry'
import { isTooManyTries, TooManyTries } from "./utils/errors/tooManyTries";

const should = require("chai").should();
chai.should();
chai.use(sinonChai);

describe("Retry", function () {
  const realDefaultRetryOptions = getDefaultRetryOptions();
  after(function () {
    setDefaultRetryOptions(realDefaultRetryOptions);
  });

  beforeEach(function () {
    setDefaultRetryOptions({ delay: 10, maxTry: 10 });
  });

  it("cb works the first time, retry should not re-call it", async function () {
    const callback = sinon.stub();
    await retry(callback);
    callback.should.have.been.calledOnce;
  });

  it("work after three times, retry should call it while cb throws exception", async function () {
    const callback = sinon.stub();
    callback.onFirstCall().throws("BOOM");
    callback.onSecondCall().throws("BOOM");
    await retry(callback);
    callback.should.have.been.calledThrice;
  });

  it('always failed, retry should give up after default "maxTry"', async function () {
    const callback = sinon.stub();
    callback.throws("BOOM");
    try {
      await retry(callback);
    } catch (err) { }
    callback.should.have.been.callCount(getDefaultRetryOptions().maxTry!);
  });

  it("always failed, retry should give up after given maxTry", async function () {
    const callback = sinon.stub();
    callback.throws("BOOM");
    const options: RetryOptions<void> = { delay: 3, maxTry: 100 };
    try {
      await retry(callback, options);
    } catch (err) { }
    callback.should.have.been.callCount(options.maxTry!);
  });

  describe("Retry with until", function () {
    it("Returns immediatly: until is ok", async function () {
      const result = 1;
      const callback = sinon.stub();
      callback.returns(result);
      const until = sinon.stub();
      until.withArgs(result).returns(true);
      await retry(callback, { until });
      callback.should.have.been.calledOnce;
      until.should.have.been.calledOnce;
    });
    it("Fails: result is always rejected by until", async function () {
      const result = 1;
      const callback = sinon.stub();
      callback.returns(result);
      const until = sinon.stub();
      until.withArgs(result).returns(false);
      const maxTry = 3;
      try {
        await retry(callback, { maxTry, until });
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        until.should.have.been.callCount(maxTry);
        isTooManyTries(err).should.be.true;
        (err as TooManyTries<any>).getLastResult().should.equals(result)
      }
    });
    it("Call the callback until the result is accepted", async function () {
      const result = 1;
      const callback = sinon.stub();
      callback.returns(result);
      const until = sinon.stub();
      until.withArgs(result).returns(false).returns(true);
      const maxTry = 3;
      try {
        await retry(callback, { maxTry, until });
      } catch (err) {
        callback.should.have.been.callCount(2);
        until.should.have.been.callCount(2);
      }
    });
    it("Fails: result is always rejected by until", async function () {
      const result = 1;
      const errMsg = "BOOM";
      const callback = sinon.stub();
      callback.throws(new Error(errMsg));
      const until = sinon.stub();
      until.withArgs(result).returns(false);
      const maxTry = 3;
      try {
        await retry(callback, { maxTry, until });
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        until.should.have.been.callCount(0);
        isTooManyTries(err).should.be.false;
        (err as Error).message.should.equals(errMsg);
      }
    });
    it("Fails: onMaxRetryFunc should be called on TooManyRetries when defined", async function () {
      const result = 1;
      const errMsg = "BOOM";
      const callback = sinon.stub();
      callback.throws(new Error(errMsg));
      const until = sinon.stub();
      until.withArgs(result).returns(false);
      const maxTry = 3;
      let shouldBeCalled = false
      const beforeTooManyErrorsFn = (err: Error) => {
        shouldBeCalled = true
      }
      try {
        await retry(callback, { maxTry, until, onMaxRetryFunc: beforeTooManyErrorsFn });
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        until.should.have.been.callCount(0);
        isTooManyTries(err).should.be.false;
        (err as Error).message.should.equals(errMsg);
        shouldBeCalled.should.equals(true)
      }
    });
  });
});
