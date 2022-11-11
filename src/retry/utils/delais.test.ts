import * as sinon from "sinon";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { createExponetialDelay, createMutiplicableDelay, createRandomDelay } from "./delay"
import { DelayParameters } from "../options";

const should = require("chai").should();
chai.should();
chai.use(sinonChai);

describe('Delay utilities', () => {
  const initialDelayParameters: DelayParameters<number> = {
    currentTry: 1,
    maxTry: 10,
  }

  it('should return exponential delays', () => {
    const delay = createExponetialDelay(20)
    let lastDelay: undefined | number = undefined
    for (let expectedDelay = 20, currentTry = 1; currentTry < 50; currentTry++, expectedDelay *= 20) {
      lastDelay = delay({ ...initialDelayParameters, currentTry, lastDelay })
      lastDelay.should.be.equal(expectedDelay)
    }
  })

  it('should return mutiplcated delays', () => {
    const delay = createMutiplicableDelay(20, 3)
    let lastDelay: undefined | number = undefined
    for (let expectedDelay = 20, currentTry = 1; currentTry < 20; currentTry++, expectedDelay = (currentTry - 1) * 3 * 20) {
      lastDelay = delay({ ...initialDelayParameters, currentTry, lastDelay })
      lastDelay.should.be.equal(expectedDelay)
    }
  })

  it('Should returns delay within min and max', () => {
    const min = 3
    const max = 72
    const delay = createRandomDelay(min, max)
    let lastDelay: undefined | number = undefined
    for (let currentTry = 1; currentTry < 20; currentTry++) {
      lastDelay = delay({ ...initialDelayParameters, currentTry, lastDelay })
      lastDelay.should.be.greaterThanOrEqual(min)
      lastDelay.should.be.lessThanOrEqual(max)
    }
  })
})