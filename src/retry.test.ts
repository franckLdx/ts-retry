import * as sinon from "sinon";
import { retry, RetryOptions } from ".";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("Retry", () => {
  it("cb works the first time, retry should not re-call it", async () => {
    const callback = sinon.stub();
    await retry(callback, { delay: 10, maxTry: 10 });
    callback.should.have.been.calledOnce;
  });
  it("work after three times, retry should call it while cb throws exception", async () => {
    const callback = sinon.stub();
    callback.onFirstCall().throws("BOOM");
    callback.onSecondCall().throws("BOOM");
    await retry(callback, { delay: 10, maxTry: 10 });
    callback.should.have.been.calledThrice;
  });
  it('always failed, retry should give up after "maxTry"', async () => {
    const callback = sinon.stub();
    callback.throws("BOOM");
    const options: RetryOptions = { delay: 3, maxTry: 100 };
    try {
      await retry(callback, options);
    } catch (err) {}
    callback.should.have.been.callCount(options.maxTry);
  });
});
