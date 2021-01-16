import { retryAsyncUntilDefined, retryUntilDefined } from "./untilDefined";
import * as sinon from "sinon";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { isTooManyTries } from "../tooManyTries";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("Retry Util", function () {
  describe("RetryUntilDefined", function () {
    it("Success: returns a defined value immediatly", async function () {
      const result = 1;
      const callback = sinon.stub();
      callback.returns(result);
      await retryUntilDefined(callback);
      callback.should.have.been.calledOnce;
    });

    it("Success one returns a defined value", async function () {
      const result = 1;
      const callback = sinon.stub();
      callback.onFirstCall().returns(undefined);
      callback.onSecondCall().returns(null);
      callback.onThirdCall().returns(result);
      await retryUntilDefined(callback);
      callback.should.have.been.callCount(3);
    });

    it("Fails: always return undefined or null", async function () {
      const result = undefined;
      const callback = sinon.stub();
      callback.returns(result);
      const maxTry = 3;
      try {
        await retryUntilDefined(callback, { maxTry, delay: 2 });
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        isTooManyTries(err).should.be.true;
      }
    });

    it("Fails: fn always throw an error", async function () {
      const errMsg = "BOOM";
      const callback = sinon.stub();
      callback.throws(new Error(errMsg));
      const maxTry = 3;
      try {
        await retryUntilDefined(callback, { maxTry, delay: 2 });
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        isTooManyTries(err).should.be.false;
        (err as Error).message.should.equals(errMsg);
      }
    });
  });

  describe("RetryAsyncUntilDefined", function () {
    it("Success: returns a defined value immediatly", async function () {
      const result = 1;
      const callback = sinon.stub();
      callback.resolves(result);
      await retryAsyncUntilDefined(callback);
      callback.should.have.been.calledOnce;
    });

    it("Success one returns a defined value", async function () {
      const result = 1;
      const callback = sinon.stub();
      callback.onFirstCall().resolves(undefined);
      callback.onSecondCall().resolves(null);
      callback.onThirdCall().resolves(result);
      await retryUntilDefined(callback);
      callback.should.have.been.callCount(3);
    });

    it("Fails: always return undefined or null", async function () {
      const result = undefined;
      const callback = sinon.stub();
      callback.resolves(result);
      const maxTry = 3;
      try {
        await retryUntilDefined(callback, { maxTry, delay: 2 });
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        isTooManyTries(err).should.be.true;
      }
    });

    it("Fails: fn always throw an error", async function () {
      const errMsg = "BOOM";
      const callback = sinon.stub();
      callback.rejects(new Error(errMsg));
      const maxTry = 3;
      try {
        await retryUntilDefined(callback, { maxTry, delay: 2 });
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        isTooManyTries(err).should.be.false;
        (err as Error).message.should.equals(errMsg);
      }
    });
  });
});
