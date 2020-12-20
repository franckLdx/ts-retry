import * as sinon from "sinon";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import {
  getDefaultRetryOptions,
  retry,
  RetryOptions,
  setDefaultRetryOptions,
} from ".";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("Retry", () => {
  let realDefaultRetryOptions: RetryOptions;
  before(() => {
    realDefaultRetryOptions = getDefaultRetryOptions();
  });
  after(() => {
    setDefaultRetryOptions(realDefaultRetryOptions);
  });

  beforeEach(() => {
    setDefaultRetryOptions({ delay: 10, maxTry: 10 });
  });
  it("cb works the first time, retry should not re-call it", async () => {
    const callback = sinon.stub();
    await retry(callback);
    callback.should.have.been.calledOnce;
  });
  it("work after three times, retry should call it while cb throws exception", async () => {
    const callback = sinon.stub();
    callback.onFirstCall().throws("BOOM");
    callback.onSecondCall().throws("BOOM");
    await retry(callback);
    callback.should.have.been.calledThrice;
  });
  it('always failed, retry should give up after default "maxTry"', async () => {
    const callback = sinon.stub();
    callback.throws("BOOM");
    try {
      await retry(callback);
    } catch (err) {}
    callback.should.have.been.callCount(getDefaultRetryOptions().maxTry);
  });
  it('always failed, retry should give up after custom "maxTry"', async () => {
    const callback = sinon.stub();
    callback.throws("BOOM");
    const options: RetryOptions = { delay: 3, maxTry: 100 };
    try {
      await retry(callback, options);
    } catch (err) {}
    callback.should.have.been.callCount(options.maxTry);
  });
});

describe("RetryDefaultOption", () => {
  let realDefaultRetryOptions: RetryOptions;
  before(() => {
    realDefaultRetryOptions = getDefaultRetryOptions();
  });
  after(() => {
    setDefaultRetryOptions(realDefaultRetryOptions);
  });

  it("Should have the expected default value", () => {
    getDefaultRetryOptions().should.deep.equals({ delay: 250, maxTry: 4 * 60 });
  });

  it("defaultOptions can be changed", async () => {
    const newOptions: RetryOptions = { maxTry: 10, delay: 10 };
    const defaultOptions = setDefaultRetryOptions(newOptions);
    defaultOptions.should.deep.equals(newOptions);
    getDefaultRetryOptions().should.deep.equals(newOptions);
  });

  it("default maxTry can be changed", async () => {
    const initialOptions = getDefaultRetryOptions();
    const newMaxTry = initialOptions.maxTry * 2;
    const expectedOptions: RetryOptions = {
      ...initialOptions,
      maxTry: newMaxTry,
    };
    setDefaultRetryOptions({ maxTry: newMaxTry }).should.deep.equals(
      expectedOptions,
    );
    getDefaultRetryOptions().should.deep.equals(
      expectedOptions,
    );
  });

  it("default delay can be changed", async () => {
    const initialOptions = getDefaultRetryOptions();
    const newDelay = initialOptions.delay * 2;
    const expectedOptions: RetryOptions = {
      ...initialOptions,
      delay: newDelay,
    };
    setDefaultRetryOptions({ delay: newDelay }).should.deep.equals(
      expectedOptions,
    );
    getDefaultRetryOptions().should.deep.equals(
      expectedOptions,
    );
  });
});
