import * as sinon from "sinon";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { retryAsyncUntilResponseDecorator } from "./decorators";
import { isTooManyTries } from "../errors/tooManyTries";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("Retry Util", function () {
  describe("RetryAsyncUntilResponseDecorator", function () {
    it("Success: returns {ok:true} immediatly", async function () {
      const expectedResult = { ok: true };
      const callback = sinon.stub<[], Promise<typeof expectedResult>>();
      callback.resolves(expectedResult);
      const decorated = retryAsyncUntilResponseDecorator(callback);
      const actualResult = await decorated();
      callback.should.have.been.calledOnce;
      actualResult.should.be.equal(expectedResult);
    });

    it("Success one returns {ok:true}", async function () {
      const expectedResult = { ok: true };
      const callback = sinon.stub<
        [],
        Promise<typeof expectedResult | { ok: boolean }>
      >();
      callback.onFirstCall().resolves({ ok: false });
      callback.onSecondCall().resolves({ ok: false });
      callback.onThirdCall().resolves(expectedResult);
      const decorated = retryAsyncUntilResponseDecorator(callback);
      const actualResult = await decorated();
      callback.should.have.been.callCount(3);
      actualResult!.should.be.equal(expectedResult);
    });

    it("Fails: always return falsy value", async function () {
      const result = { ok: false };
      const callback = sinon.stub<[], Promise<typeof result>>();
      callback.resolves(result);
      const maxTry = 3;
      const decorated = retryAsyncUntilResponseDecorator(
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
      const decorated = retryAsyncUntilResponseDecorator(
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
