"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const _1 = require(".");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const retry_1 = require("./retry");
const should = require("chai").should();
chai.should();
chai.use(sinonChai);
describe("Retry", () => {
    beforeEach(() => {
        retry_1.setDefaulRetryOptions({ delay: 10, maxTry: 10 });
    });
    it("cb works the first time, retry should not re-call it", () => __awaiter(void 0, void 0, void 0, function* () {
        const callback = sinon.stub();
        yield _1.retry(callback);
        callback.should.have.been.calledOnce;
    }));
    it("work after three times, retry should call it while cb throws exception", () => __awaiter(void 0, void 0, void 0, function* () {
        const callback = sinon.stub();
        callback.onFirstCall().throws("BOOM");
        callback.onSecondCall().throws("BOOM");
        yield _1.retry(callback);
        callback.should.have.been.calledThrice;
    }));
    it('always failed, retry should give up after default "maxTry"', () => __awaiter(void 0, void 0, void 0, function* () {
        const callback = sinon.stub();
        callback.throws("BOOM");
        try {
            yield _1.retry(callback);
        }
        catch (err) { }
        callback.should.have.been.callCount(retry_1.getDefaulRetryOptions().maxTry);
    }));
    it('always failed, retry should give up after custom "maxTry"', () => __awaiter(void 0, void 0, void 0, function* () {
        const callback = sinon.stub();
        callback.throws("BOOM");
        const options = { delay: 3, maxTry: 100 };
        try {
            yield _1.retry(callback, options);
        }
        catch (err) { }
        callback.should.have.been.callCount(options.maxTry);
    }));
});
