import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { getDefaultDuration, setDefaultDuration } from "../.";
const should = require("chai").should();

chai.should();
chai.use(sinonChai);

describe("wait option", () => {
  let defaultDuration: number;
  before(() => {
    defaultDuration = getDefaultDuration();
  });
  after(() => {
    setDefaultDuration(defaultDuration);
  });

  it("default duration should be the good one", () => {
    getDefaultDuration().should.be.equals(60 * 1000);
  });

  it("should change default duration", () => {
    const duration = 5000;
    setDefaultDuration(duration);
    getDefaultDuration().should.be.equals(duration);
  });
});
