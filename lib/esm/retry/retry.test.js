var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as sinon from "sinon";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { getDefaultRetryOptions, retry, setDefaultRetryOptions, } from ".";
const should = require("chai").should();
chai.should();
chai.use(sinonChai);
describe("Retry", () => {
    let realDefaultRetryOptions;
    before(() => {
        realDefaultRetryOptions = getDefaultRetryOptions();
    });
    after(() => {
        setDefaultRetryOptions(realDefaultRetryOptions);
    });
    beforeEach(() => {
        setDefaultRetryOptions({ delay: 10, maxTry: 10 });
    });
    it("cb works the first time, retry should not re-call it", () => __awaiter(void 0, void 0, void 0, function* () {
        const callback = sinon.stub();
        yield retry(callback);
        callback.should.have.been.calledOnce;
    }));
    it("work after three times, retry should call it while cb throws exception", () => __awaiter(void 0, void 0, void 0, function* () {
        const callback = sinon.stub();
        callback.onFirstCall().throws("BOOM");
        callback.onSecondCall().throws("BOOM");
        yield retry(callback);
        callback.should.have.been.calledThrice;
    }));
    it('always failed, retry should give up after default "maxTry"', () => __awaiter(void 0, void 0, void 0, function* () {
        const callback = sinon.stub();
        callback.throws("BOOM");
        try {
            yield retry(callback);
        }
        catch (err) { }
        callback.should.have.been.callCount(getDefaultRetryOptions().maxTry);
    }));
    it('always failed, retry should give up after custom "maxTry"', () => __awaiter(void 0, void 0, void 0, function* () {
        const callback = sinon.stub();
        callback.throws("BOOM");
        const options = { delay: 3, maxTry: 100 };
        try {
            yield retry(callback, options);
        }
        catch (err) { }
        callback.should.have.been.callCount(options.maxTry);
    }));
});
describe("RetryDefaultOption", () => {
    let realDefaultRetryOptions;
    before(() => {
        realDefaultRetryOptions = getDefaultRetryOptions();
    });
    after(() => {
        setDefaultRetryOptions(realDefaultRetryOptions);
    });
    it("Should have the expected default value", () => {
        getDefaultRetryOptions().should.deep.equals({ delay: 250, maxTry: 4 * 60 });
    });
    it("defaultOptions can be changed", () => __awaiter(void 0, void 0, void 0, function* () {
        const initialOptions = getDefaultRetryOptions();
        const newOptions = { maxTry: 10, delay: 10 };
        const defaultOptions = setDefaultRetryOptions(newOptions);
        defaultOptions.should.deep.equals(newOptions);
        getDefaultRetryOptions().should.deep.equals(newOptions);
    }));
    it("default maxTry can be changed", () => __awaiter(void 0, void 0, void 0, function* () {
        const initialOptions = getDefaultRetryOptions();
        const newMaxTry = initialOptions.maxTry * 2;
        const expectedOptions = Object.assign(Object.assign({}, initialOptions), { maxTry: newMaxTry });
        setDefaultRetryOptions({ maxTry: newMaxTry }).should.deep.equals(expectedOptions);
        getDefaultRetryOptions().should.deep.equals(expectedOptions);
    }));
    it("default delay can be changed", () => __awaiter(void 0, void 0, void 0, function* () {
        const initialOptions = getDefaultRetryOptions();
        const newDelay = initialOptions.delay * 2;
        const expectedOptions = Object.assign(Object.assign({}, initialOptions), { delay: newDelay });
        setDefaultRetryOptions({ delay: newDelay }).should.deep.equals(expectedOptions);
        getDefaultRetryOptions().should.deep.equals(expectedOptions);
    }));
});
