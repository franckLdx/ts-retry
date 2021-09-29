import sinon = require("sinon");
import { waitUntilAsyncDecorator, waitUntilDecorator } from "./decorators";

describe("Wait decorators", function () {
  it("waitUntilAsyncDecorator should execute the function", async function () {
    const timeout = 100;
    const param = "Question";
    const answer = 42;
    const callback = sinon.stub();
    callback
      .withArgs(param)
      .onFirstCall()
      .resolves(answer);
    const decorated = waitUntilAsyncDecorator(callback, timeout);
    (await decorated(param)).should.be.equals(answer);
  });

  it("waitUntilAsyncDecorator should throw the function error", async function () {
    const timeout = 100;
    const errorMsg = "BOOM";
    const error = new Error(errorMsg);
    const callback = sinon.stub().rejects(error);
    const decorated = waitUntilAsyncDecorator(callback, timeout);
    try {
      await decorated();
      throw new Error("Expected error not thrown");
    } catch (error) {
      (error as Error).message.should.be.equals(errorMsg);
    }
  });

  it(
    "waitUntilAsyncDecorator should throw an error in case of timeout",
    async function () {
      const timeout = 50;
      const answer = 42;
      const callback = () => {
        return new Promise<number>((resolve, reject) => {
          setTimeout(
            () => resolve(answer),
            timeout + 50,
          );
        });
      };
      const decorated = waitUntilAsyncDecorator(callback, timeout);
      try {
        await decorated();
        throw new Error("Expected error not thrown");
      } catch (error) {
        (error as any).isTimeout.should.be.equals(true);
      }
    },
  );

  it(
    "waitUntilAsyncDecorator should throw a custom error in case of timeout",
    async function () {
      const timeout = 50;
      const errorMsg = "BOOM";
      const callback = () => {
        return new Promise<void>((resolve, reject) => {
          setTimeout(
            () => resolve(),
            timeout + 50,
          );
        });
      };
      const decorated = waitUntilAsyncDecorator(
        callback,
        timeout,
        new Error(errorMsg),
      );
      try {
        await decorated();
        throw new Error("Expected error not thrown");
      } catch (error) {
        (error as Error).message.should.be.equals(errorMsg);
      }
    },
  );

  it("waitUntilDecorator should execute the function", async function () {
    const timeout = 100;
    const param = "Question";
    const answer = 42;
    const callback = sinon.stub();
    callback
      .withArgs(param)
      .onFirstCall()
      .returns(answer);
    const decorated = waitUntilDecorator(callback, timeout);
    (await decorated(param)).should.be.equals(answer);
  });

  it("waitUntilDecorator should throw the function error", async function () {
    const timeout = 100;
    const errorMsg = "BOOM";
    const error = new Error(errorMsg);
    const callback = sinon.stub().throws(error);
    const decorated = waitUntilDecorator(callback, timeout);
    try {
      await decorated();
      throw new Error("Expected error not thrown");
    } catch (error) {
      (error as Error).message.should.be.equals(errorMsg);
    }
  });

  it(
    "waitUntilDecorator should throw an error in case of timeout",
    async function () {
      const timeout = 50;
      const answer = 42;
      const callback = () => {
        return new Promise<number>((resolve, reject) => {
          setTimeout(
            () => resolve(answer),
            timeout + 50,
          );
        });
      };
      const decorated = waitUntilDecorator(callback, timeout);
      try {
        await decorated();
        throw new Error("Expected error not thrown");
      } catch (error) {
        (error as any).isTimeout.should.be.equals(true);
      }
    },
  );

  it(
    "waitUntilDecorator should throw a custom error in case of timeout",
    async function () {
      const timeout = 50;
      const errorMsg = "BOOM";
      const callback = () => {
        return new Promise<void>((resolve, reject) => {
          setTimeout(
            () => resolve(),
            timeout + 50,
          );
        });
      };
      const decorated = waitUntilDecorator(
        callback,
        timeout,
        new Error(errorMsg),
      );
      try {
        await decorated();
        throw new Error("Expected error not thrown");
      } catch (error) {
        (error as Error).message.should.be.equals(errorMsg);
      }
    },
  );
});
