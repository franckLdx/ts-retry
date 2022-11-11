import { DELAY } from "../options";

export function createExponetialDelay<RETURN_TYPE>(initialDelay: number): DELAY<RETURN_TYPE> {
  const delay: DELAY<RETURN_TYPE> = ({ lastDelay }) => lastDelay !== undefined ? lastDelay * initialDelay : initialDelay
  return delay
}

export function createMutiplicableDelay<RETURN_TYPE>(initialDelay: number, multiplicator: number): DELAY<RETURN_TYPE> {
  const delay: DELAY<RETURN_TYPE> = ({ currentTry }) => {
    if (currentTry === 1) {
      return initialDelay
    }
    const actualMultiplicator = (currentTry - 1) * multiplicator
    return initialDelay * actualMultiplicator
  }

  return delay
}

export function createRandomDelay<RETURN_TYPE>(min: number, max: number): DELAY<RETURN_TYPE> {
  const multiplicator = max - min + 1
  return () => Math.floor(Math.random() * multiplicator + min)
}