"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExponetialDelay = createExponetialDelay;
exports.createMutiplicableDelay = createMutiplicableDelay;
exports.createRandomDelay = createRandomDelay;
function createExponetialDelay(initialDelay) {
    const delay = ({ lastDelay }) => lastDelay !== undefined ? lastDelay * initialDelay : initialDelay;
    return delay;
}
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
function createRandomDelay(min, max) {
    const multiplicator = max - min + 1;
    return () => Math.floor(Math.random() * multiplicator + min);
}
