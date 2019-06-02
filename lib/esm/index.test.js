var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as sinon from 'sinon';
import { retry } from '.';
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
chai.should();
chai.use(sinonChai);
describe('Retry', () => {
    it('cb works the first time, retry should not re-call it', () => __awaiter(this, void 0, void 0, function* () {
        const callback = sinon.stub();
        yield retry(callback, { delay: 10, maxTry: 10 });
        callback.should.have.been.calledOnce;
    }));
    it('work after three times, retry should call it while cb throws exception', () => __awaiter(this, void 0, void 0, function* () {
        const callback = sinon.stub();
        callback.onFirstCall().throws('BOOM');
        callback.onSecondCall().throws('BOOM');
        yield retry(callback, { delay: 10, maxTry: 10 });
        callback.should.have.been.calledThrice;
    }));
    it('always failed, retry should give up after "maxTry"', () => __awaiter(this, void 0, void 0, function* () {
        const callback = sinon.stub();
        callback.throws('BOOM');
        const options = { delay: 3, maxTry: 100 };
        try {
            yield retry(callback, options);
        }
        catch (err) { }
        callback.should.have.been.callCount(options.maxTry);
    }));
});
