import { retryAsyncUntilResponse } from "./retry";
import * as sinon from "sinon";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { RESPONSE_TYPE } from "./type";
import { isTooManyTries } from "../errors/tooManyTries";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("Retry Util", function () {
  describe("RetryAsyncUntilresponse", function () {
    it("Success: ok=true, returns value immediatly", async function () {
      const expectedResult = {
        ok: true,
        body: "foo",
      };
      const callback = sinon.stub<any, Promise<typeof expectedResult>>();
      callback.resolves(expectedResult);
      const actualResult = await retryAsyncUntilResponse(callback);
      callback.should.have.been.calledOnce;
      actualResult.should.equals(expectedResult);
    });

    it("Success one returns ok", async function () {
      const expectedResult = {
        ok: true,
        body: "foo",
      };
      const callback = sinon.stub<
        any,
        Promise<typeof expectedResult | RESPONSE_TYPE>
      >();
      callback.onFirstCall().resolves({ ok: false });
      callback.onSecondCall().resolves({ ok: false });
      callback.onThirdCall().resolves(expectedResult);
      const actualResult = await retryAsyncUntilResponse(callback);
      callback.should.have.been.callCount(3);
      actualResult!.should.equals(expectedResult);
    });

    it("Fails: always return a falsy value", async function () {
      const result = { ok: false };
      const callback = sinon.stub<any, Promise<typeof result>>();
      callback.resolves(result);
      const maxTry = 3;
      try {
        await retryAsyncUntilResponse(callback, { maxTry, delay: 2 });
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
        await retryAsyncUntilResponse(callback, { maxTry, delay: 2 });
      } catch (err) {
        callback.should.have.been.callCount(maxTry);
        isTooManyTries(err).should.be.false;
        (err as Error).message.should.equals(errMsg);
      }
    });
  });
});
