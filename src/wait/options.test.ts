import * as chai from "chai";
import sinonChai from "sinon-chai";
import { getDefaultDuration, setDefaultDuration } from "../.";

chai.should();
chai.use(sinonChai);

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
