import {
  retryAsyncUntilDefinedDecorator,
  retryUntilDefinedDecorator,
} from "./decorator";
import * as sinon from "sinon";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { isTooManyTries } from "../errors/tooManyTries";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("Retry Util", function () {
  describe("RetryUntilDefinedDecorator", function () {
    it("Success: returns a defined value immediatly", async function () {
      const expectedResult = 1;
      const callback = sinon.stub<[], number>();
      callback.returns(expectedResult);
      const decorated = retryUntilDefinedDecorator(callback);
      const actualResult = await decorated();
      callback.should.have.been.calledOnce;
      actualResult.should.be.equal(expectedResult);
    });

    it("Success one returns a defined value", async function () {
      const expectedResult = 1;
      const callback = sinon.stub<[], number | undefined | null>();
      callback.onFirstCall().returns(undefined);
      callback.onSecondCall().returns(null);
      callback.onThirdCall().returns(expectedResult);
      const decorated = retryUntilDefinedDecorator(callback);
      const actualResult = await decorated();
      callback.should.have.been.callCount(3);
      actualResult.should.be.equal(expectedResult);
    });

    it("Fails: always return undefined or null", async function () {
      const result = undefined;
      const callback = sinon.stub<[], number | undefined>();
      callback.returns(result);
      const maxTry = 3;
      const decorated = retryUntilDefinedDecorator(
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
      const decorated = retryUntilDefinedDecorator(
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

  describe("RetryAsyncUntilDefinedDecorator", function () {
    it("Success: returns a defined value immediatly", async function () {
      const expectedResult = 1;
      const callback = sinon.stub<[], Promise<number>>();
      callback.resolves(expectedResult);
      const decorated = retryAsyncUntilDefinedDecorator(callback);
      const actualResult = await decorated();
      callback.should.have.been.calledOnce;
      actualResult.should.be.equal(expectedResult);
    });

    it("Success one returns a defined value", async function () {
      const expectedResult = 1;
      const callback = sinon.stub<[], Promise<number | undefined | null>>();
      callback.onFirstCall().resolves(undefined);
      callback.onSecondCall().resolves(null);
      callback.onThirdCall().resolves(expectedResult);
      const decorated = retryAsyncUntilDefinedDecorator(callback);
      const actualResult = await decorated();
      callback.should.have.been.callCount(3);
      actualResult.should.be.equal(expectedResult);
    });

    it("Fails: always return undefined or null", async function () {
      const result = undefined;
      const callback = sinon.stub<[], Promise<number | undefined>>();
      callback.resolves(result);
      const maxTry = 3;
      const decorated = retryAsyncUntilDefinedDecorator(
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
      const decorated = retryAsyncUntilDefinedDecorator(
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
