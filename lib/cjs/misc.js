"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertDefined = exports.asyncDecorator = void 0;
const asyncDecorator = (fn) => () => new Promise((resolve, reject) => {
    try {
        resolve(fn());
    }
    catch (err) {
        reject(err);
    }
});
exports.asyncDecorator = asyncDecorator;
const assertDefined = (value, errMsg) => {
    if (value === undefined || value == null) {
        throw new Error(errMsg);
    }
    return true;
};
exports.assertDefined = assertDefined;
