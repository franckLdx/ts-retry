"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncDecorator = void 0;
const asyncDecorator = (fn) => () => new Promise((resolve, reject) => {
    try {
        resolve(fn());
    }
    catch (err) {
        reject(err);
    }
});
exports.asyncDecorator = asyncDecorator;
