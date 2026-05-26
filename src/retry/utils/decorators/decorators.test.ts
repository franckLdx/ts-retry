import { isTooManyTries } from "../errors/tooManyTries";
import { retryAsyncDecorator, retryDecorator } from "./decorators";

import * as sinon from "sinon";
const should = require("chai").should();

describe("Retry decorator", () => {
  it("async decorator should return the valid result", async () => {
    const param = "Question";
    const answer = 42;
    const callback = sinon.stub();
    callback
      .withArgs(param)
      .onFirstCall()
      .resolves(answer);
    const decorated = retryAsyncDecorator(callback);
    (await decorated(param)).should.be.equals(answer);
    callback.should.have.been.callCount(1);
  });

  it("async decorator should throw an exception", async () => {
    const param = "Question";
    const errorMsg = "BOOM";
    const error = new Error(errorMsg);
    const maxTry = 2;
    const callback = sinon.stub();
    callback.rejects(error);
    const decorated = retryAsyncDecorator(callback, { maxTry, delay: 50 });
    try {
      await decorated(param);
      throw new Error("Expected error not thrown");
    } catch (error) {
      (error as Error).message.should.be.equals(errorMsg);
      callback.should.have.been.callCount(maxTry);
    }
  });

  it("decorator should return the valid result", async () => {
    const param = "Question";
    const answer = 42;
    const callback = sinon.stub();
    callback
      .withArgs(param)
      .onFirstCall()
      .returns(answer);
    const decorated = retryDecorator(callback);
    (await decorated(param)).should.be.equals(answer);
    callback.should.have.been.callCount(1);
  });

  it("decorator should throw an exception", async () => {
    const param = "Question";
    const errorMsg = "BOOM";
    const callback = sinon.stub();
    const error = new Error(errorMsg);
    const maxTry = 2;
    callback.throws(error);
    const decorated = retryDecorator(callback, { maxTry, delay: 50 });
    try {
      await decorated(param);
      throw new Error("Expected error not thrown");
    } catch (error) {
      (error as Error).message.should.be.equals(errorMsg);
      callback.should.have.been.callCount(maxTry);
    }
  });

  describe("Decorator should use 'until' callback", async () => {
    it("should return a valid result", async () => {
      const param = "Question";
      const answer = 42;
      const callback = sinon.stub();
      callback
        .withArgs(param)
        .onFirstCall()
        .returns(answer);
      const until = sinon.stub();
      until.withArgs(answer).returns(true);
      const decorated = retryDecorator(callback, { until });
      (await decorated(param)).should.be.equals(answer);
      callback.should.have.been.callCount(1);
      until.should.have.been.callCount(1);
    });

    it("should return a valid result when until returs true", async () => {
      const param = "Question";
      const answer = 42;
      const callback = sinon.stub();
      callback
        .withArgs(param)
        .returns(answer);
      const until = sinon.stub();
      until.onCall(0).returns(false);
      until.onCall(1).returns(true);
      const decorated = retryDecorator(callback, { delay: 5, until });
      (await decorated(param)).should.be.equals(answer);
      callback.should.have.been.callCount(2);
      until.should.have.been.callCount(2);
    });

    it("should throw an error when callback fails", async () => {
      const param = "Question";
      const errorMsg = "BOOM";
      const callback = sinon.stub();
      const error = new Error(errorMsg);
      const maxTry = 2;
      const until = sinon.stub();
      callback.throws(error);
      const decorated = retryDecorator(callback, { maxTry, delay: 50, until });
      try {
        await decorated(param);
        throw new Error("Expected error not thrown");
      } catch (error) {
        (error as Error).message.should.be.equals(errorMsg);
        callback.should.have.been.callCount(maxTry);
        until.should.have.been.callCount(0);
      }
    });

    it("should throw a TooManyTries when 'until' always return false", async () => {
      const maxTry = 3;
      const param = "Question";
      const answer = 42;
      const callback = sinon.stub();
      callback
        .withArgs(param)
        .returns(answer);
      const until = sinon.stub();
      until.withArgs(answer).returns(false);
      const decorated = retryDecorator(
        callback,
        { maxTry: 3, delay: 10, until },
      );
      try {
        await decorated(param);
        throw new Error("Expected error not thrown");
      } catch (error) {
        isTooManyTries(error).should.be.true;
        callback.should.have.been.callCount(maxTry);
        until.should.have.been.callCount(maxTry);
      }
    });
  });
});
