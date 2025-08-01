import * as sinon from "sinon";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { retryAsyncUntilTruthy, retryUntilTruthy } from "./retry";
import { isTooManyTries } from "../errors/tooManyTries";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("Retry Util", function () {
  describe("RetryUntilThruthy", function () {
    it("Success: returns a truthy value immediatly", async function () {
      const expectedResult = 1;
      const callback = sinon.stub<any, number>();
      callback.returns(expectedResult);
      const actualResult = await retryUntilTruthy(callback);
      callback.should.have.been.calledOnce;
      actualResult.should.be.equal(expectedResult);
    });

    it("Success one returns a truthy value", async function () {
      const expectedResult = 1;
      const callback = sinon.stub<any, number | undefined | null>();
      callback.onFirstCall().returns(undefined);
      callback.onSecondCall().returns(null);
      callback.onThirdCall().returns(expectedResult);
      const actualResult = await retryUntilTruthy(callback);
      callback.should.have.been.callCount(3);
      actualResult!.should.be.equal(expectedResult);
    });

    it("Fails: always return falsy values", async function () {
      const result = -1;
      const callback = sinon.stub<any, number>();
      callback.returns(result);
      const maxTry = 3;
      try {
        await retryUntilTruthy(callback, { maxTry, delay: 2 });
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        isTooManyTries(err).should.be.true;
      }
    });

    it("Fails: fn always throw an error", async function () {
      const errMsg = "BOOM";
      const callback = sinon.stub<any, number>();
      callback.throws(new Error(errMsg));
      const maxTry = 3;
      try {
        await retryUntilTruthy(callback, { maxTry, delay: 2 });
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        isTooManyTries(err).should.be.false;
        (err as Error).message.should.equals(errMsg);
      }
    });
  });

  describe("RetryAsyncUntilTruthy", function () {
    it("Success: returns a truthy value immediatly", async function () {
      const expectedResult = 1;
      const callback = sinon.stub<any, Promise<number>>();
      callback.resolves(expectedResult);
      const actualResult = await retryAsyncUntilTruthy(callback);
      callback.should.have.been.calledOnce;
      actualResult.should.equals(expectedResult);
    });

    it("Success one returns truthy value", async function () {
      const expectedResult = 1;
      const callback = sinon.stub<any, Promise<number | undefined | null>>();
      callback.onFirstCall().resolves(undefined);
      callback.onSecondCall().resolves(null);
      callback.onThirdCall().resolves(expectedResult);
      const actualResult = await retryAsyncUntilTruthy(callback);
      callback.should.have.been.callCount(3);
      actualResult!.should.equals(expectedResult);
    });

    it("Fails: always return a falsy value", async function () {
      const result = false;
      const callback = sinon.stub<any, Promise<boolean>>();
      callback.resolves(result);
      const maxTry = 3;
      try {
        await retryAsyncUntilTruthy(callback, { maxTry, delay: 2 });
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
        await retryAsyncUntilTruthy(callback, { maxTry, delay: 2 });
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        isTooManyTries(err).should.be.false;
        (err as Error).message.should.equals(errMsg);
      }
    });
  });
});
