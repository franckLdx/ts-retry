import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import {
  getDefaultRetryOptions,
  RetryOptions,
  setDefaultRetryOptions,
} from ".";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("RetryDefaultOption", function () {
  let realDefaultRetryOptions: RetryOptions;
  before(function () {
    realDefaultRetryOptions = getDefaultRetryOptions();
  });
  after(function () {
    setDefaultRetryOptions(realDefaultRetryOptions);
  });

  it("Should have the expected default value", function () {
    getDefaultRetryOptions().should.deep.equals(
      { delay: 250, maxTry: 4 * 60, until: null },
    );
  });

  it("defaultOptions can be changed", async function () {
    const initialOptions = getDefaultRetryOptions();
    const newOptions: RetryOptions<void> = {
      maxTry: 10,
      delay: 10,
      until: () => false,
    };
    const defaultOptions = setDefaultRetryOptions(newOptions);
    defaultOptions.should.deep.equals(newOptions);
    getDefaultRetryOptions().should.deep.equals(newOptions);
  });

  it("default maxTry can be changed", async function () {
    const initialOptions = getDefaultRetryOptions();
    const newMaxTry = initialOptions.maxTry! * 2;
    const expectedOptions: RetryOptions<void> = {
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

  it("default delay can be changed", async function () {
    const initialOptions = getDefaultRetryOptions();
    const newDelay = initialOptions.delay! * 2;
    const expectedOptions: RetryOptions<void> = {
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

  it("default until can be changed", async function () {
    const initialOptions = getDefaultRetryOptions();
    const newUntil = (result: string) => true;
    const expectedOptions: RetryOptions<string> = {
      ...initialOptions,
      until: newUntil,
    };
    setDefaultRetryOptions({ until: newUntil }).should.deep.equals(
      expectedOptions,
    );
    getDefaultRetryOptions().should.deep.equals(
      expectedOptions,
    );
  });
});
