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
    const initialOptions = getDefaultRetryOptions();
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
