"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomDelay = exports.createMutiplicableDelay = exports.createExponetialDelay = void 0;
function createExponetialDelay(initialDelay) {
    const delay = ({ lastDelay }) => lastDelay !== undefined ? lastDelay * initialDelay : initialDelay;
    return delay;
}
exports.createExponetialDelay = createExponetialDelay;
function createMutiplicableDelay(initialDelay, multiplicator) {
    const delay = ({ currentTry }) => {
        if (currentTry === 1) {
            return initialDelay;
        }
        const actualMultiplicator = (currentTry - 1) * multiplicator;
        return initialDelay * actualMultiplicator;
    };
    return delay;
}
exports.createMutiplicableDelay = createMutiplicableDelay;
function createRandomDelay(min, max) {
    const multiplicator = max - min + 1;
    return () => Math.floor(Math.random() * multiplicator + min);
}
exports.createRandomDelay = createRandomDelay;
