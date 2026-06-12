export function createExponetialDelay(initialDelay) {
    const delay = ({ lastDelay }) => lastDelay !== undefined ? lastDelay * initialDelay : initialDelay;
    return delay;
}
export function createMutiplicableDelay(initialDelay, multiplicator) {
    const delay = ({ currentTry }) => {
        if (currentTry === 1) {
            return initialDelay;
        }
        const actualMultiplicator = (currentTry - 1) * multiplicator;
        return initialDelay * actualMultiplicator;
    };
    return delay;
}
export function createRandomDelay(min, max) {
    const multiplicator = max - min + 1;
    return () => Math.floor(Math.random() * multiplicator + min);
}
