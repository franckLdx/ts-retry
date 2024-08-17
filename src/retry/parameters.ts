import { defaultDelay, defaultMaxTry, DELAY, getDefaultRetryOptions, RetryOptions, UNTIL } from "./options"

export interface RetryParameters<RETURN_TYPE> {
  currentTry: number
  maxTry: number
  lastDelay?: number
  delay: DELAY<RETURN_TYPE>
  until: UNTIL<RETURN_TYPE>
  onMaxRetryFunc?: (err: Error, currentTry:number) => void;
  onSuccessFunc?: (result:RETURN_TYPE, currentTry:number)=>void;
  onError?: (err: Error, currentTry:number) => void;
}

export function getRetryParameters<RETURN_TYPE>(currentTry: number, retryOptions?: RetryOptions<RETURN_TYPE>): Readonly<
  RetryParameters<RETURN_TYPE>
> {
  const fullOptions = { ...getDefaultRetryOptions(), ...retryOptions };
  return {
    ...fullOptions,
    currentTry,
    maxTry: fullOptions.maxTry || defaultMaxTry,
    delay: getDelay(fullOptions.delay),
    until: fullOptions.until ? fullOptions.until : () => true
  }
}

function getDelay<RETURN_TYPE>(delay: DELAY<RETURN_TYPE> | number | undefined): DELAY<RETURN_TYPE> {
  if (delay === undefined) {
    return () => defaultDelay;
  }
  if (typeof delay === 'function') {
    return delay;
  }
  return () => delay
}
