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
import { retry, waitUntil } from ".";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
const should = require("chai").should();
chai.should();
chai.use(sinonChai);
describe("Retry", () => {
    it("cb works the first time, retry should not re-call it", () => __awaiter(void 0, void 0, void 0, function* () {
        const callback = sinon.stub();
        yield retry(callback, { delay: 10, maxTry: 10 });
        callback.should.have.been.calledOnce;
    }));
    it("work after three times, retry should call it while cb throws exception", () => __awaiter(void 0, void 0, void 0, function* () {
        const callback = sinon.stub();
        callback.onFirstCall().throws("BOOM");
        callback.onSecondCall().throws("BOOM");
        yield retry(callback, { delay: 10, maxTry: 10 });
        callback.should.have.been.calledThrice;
    }));
    it('always failed, retry should give up after "maxTry"', () => __awaiter(void 0, void 0, void 0, function* () {
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
describe("WaitUntil", () => {
    it("wait should return function return code", () => __awaiter(void 0, void 0, void 0, function* () {
        const delay = 1000;
        const result = Symbol("OK");
        const fn = () => __awaiter(void 0, void 0, void 0, function* () { return result; });
        const actualResult = yield waitUntil(fn, delay);
        actualResult.should.equal(result);
    }));
    it("wait should throw function exception", () => __awaiter(void 0, void 0, void 0, function* () {
        const delay = 1000;
        const errorMsg = "BOOM";
        const fn = () => __awaiter(void 0, void 0, void 0, function* () {
            throw new Error(errorMsg);
        });
        let actualErr = undefined;
        try {
            yield waitUntil(fn, delay);
        }
        catch (err) {
            actualErr = err;
        }
        if (actualErr === undefined) {
            throw new Error("Should have thrown an exception");
        }
        actualErr.message.should.equal(errorMsg);
    }));
    it("wait should throw TimeoutError exception", () => __awaiter(void 0, void 0, void 0, function* () {
        const delay = 1000;
        const fn = () => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(() => resolve(1), delay * 2));
        });
        let actualErr = undefined;
        try {
            yield waitUntil(fn, delay);
        }
        catch (err) {
            actualErr = err;
        }
        if (actualErr === undefined) {
            throw new Error("Should have thrown an exception");
        }
        actualErr.isTimeout.should.equal(true);
    }));
    it("wait should throw a custom exception", () => __awaiter(void 0, void 0, void 0, function* () {
        const delay = 1000;
        const errMsg = "Boom";
        const fn = () => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(() => resolve(1), delay * 2));
        });
        let actualErr = undefined;
        try {
            yield waitUntil(fn, delay, new Error(errMsg));
        }
        catch (err) {
            actualErr = err;
        }
        if (actualErr === undefined) {
            throw new Error("Should have thrown an exception");
        }
        should.not.exist(actualErr.isTimeout);
        (actualErr).message.should.equal(errMsg);
    }));
});
