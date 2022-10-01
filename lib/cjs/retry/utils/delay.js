"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMutiplicableDelay = exports.createExponetialDelay = void 0;
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
