import { getRetryParameters } from "./parameters";
import { expect } from "chai";
import { describe } from "mocha";
import { DELAY, getDefaultRetryOptions, setDefaultRetryOptions } from "./options";

describe('Parameters', () => {
  const realDefaultRetryOptions = getDefaultRetryOptions();

  after(function () {
    setDefaultRetryOptions(realDefaultRetryOptions);
  });

  it('should manag currentTry', () => {
    const { currentTry } = getRetryParameters(1)
    expect(currentTry).to.equal(1)
  })

  describe('maxTry', () => {
    it('should use the given value', () => {
      const givenMaxTry = 18310
      const options = { ...getDefaultRetryOptions(), maxTry: givenMaxTry }
      const { maxTry } = getRetryParameters(1, options)
      expect(maxTry).to.equal(givenMaxTry)
    })

    it('should use the default option value', () => {
      const { maxTry } = getRetryParameters(1)
      expect(maxTry).to.equal(getDefaultRetryOptions().maxTry)
    })
  })

  describe('delay', () => {
    it('should return given delay', () => {
      const givenDelai = 100;
      const { delay } = getRetryParameters(1, { delay: givenDelai })
      expect(delay({} as any)).to.equal(givenDelai)
    })

    it('should use the given delay function', () => {
      const givenDelay: DELAY<void> = () => 100;
      const { delay } = getRetryParameters(1, { delay: givenDelay })
      expect(delay).to.equal(givenDelay)
    })

    it('should use the default delay function', () => {
      const defaultDelay: DELAY<void> = () => 100;
      setDefaultRetryOptions({ delay: defaultDelay })
      const { delay } = getRetryParameters(1)
      expect(delay).to.equal(defaultDelay)
    })
  })
})