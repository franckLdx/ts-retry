import {
  retryAsyncUntilTruthyDecorator,
  retryUntilTruthyDecorator,
} from "./decorator";
import * as sinon from "sinon";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { isTooManyTries } from "../errors/tooManyTries";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("Retry Util", function () {
  describe("RetryUntilThruthyDecorator", function () {
    it("Success: returns a truthy value immediatly", async function () {
      const expectedResult = 1;
      const callback = sinon.stub<[], number>();
      callback.returns(expectedResult);
      const decorated = retryUntilTruthyDecorator(callback);
      const actualResult = await decorated();
      callback.should.have.been.calledOnce;
      actualResult.should.be.equal(expectedResult);
    });

    it("Success one returns a truthy value", async function () {
      const expectedResult = 1;
      const callback = sinon.stub<[], number | undefined | null>();
      callback.onFirstCall().returns(undefined);
      callback.onSecondCall().returns(null);
      callback.onThirdCall().returns(expectedResult);
      const decorated = retryUntilTruthyDecorator(callback);
      const actualResult = await decorated();
      callback.should.have.been.callCount(3);
      actualResult!.should.be.equal(expectedResult);
    });

    it("Fails: always return falsy values", async function () {
      const result = undefined;
      const callback = sinon.stub<[], number | undefined>();
      callback.returns(result);
      const maxTry = 3;
      const decorated = retryUntilTruthyDecorator(
        callback,
        { maxTry, delay: 1 },
      );
      try {
        await decorated();
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
      const decorated = retryUntilTruthyDecorator(
        callback,
        { maxTry, delay: 1 },
      );
      try {
        await decorated();
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        isTooManyTries(err).should.be.false;
        (err as Error).message.should.equals(errMsg);
      }
    });
  });

  describe("RetryAsyncUntilTruthyDecorator", function () {
    it("Success: returns a truthy value immediatly", async function () {
      const expectedResult = 1;
      const callback = sinon.stub<[], Promise<number>>();
      callback.resolves(expectedResult);
      const decorated = retryAsyncUntilTruthyDecorator(callback);
      const actualResult = await decorated();
      callback.should.have.been.calledOnce;
      actualResult.should.be.equal(expectedResult);
    });

    it("Success one returns a truthy value", async function () {
      const expectedResult = 1;
      const callback = sinon.stub<[], Promise<number | undefined | null>>();
      callback.onFirstCall().resolves(undefined);
      callback.onSecondCall().resolves(null);
      callback.onThirdCall().resolves(expectedResult);
      const decorated = retryAsyncUntilTruthyDecorator(callback);
      const actualResult = await decorated();
      callback.should.have.been.callCount(3);
      actualResult!.should.be.equal(expectedResult);
    });

    it("Fails: always return falsy value", async function () {
      const result = undefined;
      const callback = sinon.stub<[], Promise<number | undefined>>();
      callback.resolves(result);
      const maxTry = 3;
      const decorated = retryAsyncUntilTruthyDecorator(
        callback,
        { maxTry, delay: 1 },
      );
      try {
        await decorated();
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
      const decorated = retryAsyncUntilTruthyDecorator(
        callback,
        { maxTry, delay: 1 },
      );
      try {
        await decorated();
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        isTooManyTries(err).should.be.false;
        (err as Error).message.should.equals(errMsg);
      }
    });
  });
});
