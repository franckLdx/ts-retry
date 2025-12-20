import * as chai from "chai";
import sinonChai = require("sinon-chai");
import "chai/register-should";
import { getDefaultDuration, setDefaultDuration } from "../.";
const should = require("chai").should();

chai.should();
const _sinonChai = (sinonChai as any).default || (sinonChai as any);
chai.use(_sinonChai);

describe("wait option", function () {
  const defaultDuration = getDefaultDuration();
  after(function () {
    setDefaultDuration(defaultDuration);
  });

  it("default duration should be the good one", function () {
    getDefaultDuration().should.be.equals(60 * 1000);
  });

  it("should change default duration", function () {
    const duration = 5000;
    setDefaultDuration(duration);
    getDefaultDuration().should.be.equals(duration);
  });
});
