import { retryAsyncDecorator, retryDecorator } from "./decorators";

import sinon = require("sinon");
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
      error.message.should.be.equals(errorMsg);
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
      error.message.should.be.equals(errorMsg);
      callback.should.have.been.callCount(maxTry);
    }
  });
});
