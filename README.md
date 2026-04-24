# ts-retry

A little retry tool to execute a function until the function is successful. Can also bind a timeout to a function.
This lib is usable in typescript, in javascript, in node, in SPA tools (rest, Vue, Svelte...) and browser (available in ESM and common js format).

---

**Recent Changes (since v5.0.0+)**:

- **v6.0.0**: `onError` callback can now return a boolean to control retry behavior:
  - Returning `true` or nothing: continue retries (default behavior)
  - Returning `false`: stop retries and throw an `AbortError`
- **AbortError**: New error type thrown when retries are aborted via `onError` returning `false`. Includes methods `getError()` (last error) and `getCurrentTry()` (attempt number).
- **v5.0.0**: `onError` and `onSuccess` callbacks now receive attempt data (`currentTry`) for better logging.
- **v5.0.1**: Fixed missing exports for `retryDecorator` and `retryAsyncDecorator`.

**Breaking change**:
To migrate to 3.x: retryAsyncDecorator and retryAsync has been moved to utils/decorators. This impacts only
those that import those functions directly from decorator.ts file.
Other 3.X items are new and imply no breaking change.

For those who are using 1.x in **typescript**, you may have to add a type to RetryOptions if you want to use
the new `until` function. This type is the called function's return type.

## How to

- to retry something:

  ```javascript
  const result = await retry(
    () => {
      /* do something */
    },
    { delay: 100, maxTry: 5 },
  );
  ```

- to retry something async :

  ```javascript
  const result = await retryAsync(
    async () => {
      /* do something */
    },
    { delay: 100, maxTry: 5 },
  );
  ```

- to retry until the answer is 42 :

  ```javascript
  try {
    await retryAsync(
      async () => {
        /* do something */
      },
      {
        delay: 100,
        maxTry: 5,
        until: (lastResult) => lastResult === 42,
      },
    );
  } catch (err) {
    if (isTooManyTries(err)) {
      // Did not get 42 after 'maxTry' calls
    } else {
      // something else goes wrong
    }
  }
  ```

- to retry with custom error handling and potential abort:

  ```javascript
  try {
    await retryAsync(
      async () => {
        /* do something that might fail */
      },
      {
        delay: 100,
        maxTry: 5,
        onError: (err, currentTry) => {
          console.log(`Attempt ${currentTry} failed: ${err.message}`);
          // Abort if it's a specific error type
          return err.message.includes("fatal") ? false : true;
        },
      },
    );
  } catch (err) {
    if (isAbortError(err)) {
      // Retries were aborted
      console.log(`Aborted at attempt ${err.getCurrentTry()}`);
    } else if (isTooManyTries(err)) {
      // Max tries reached
    } else {
      // Other error
    }
  }
  ```

- Need to call a function at multiple locations with the same retryOptions? Use decorators:

  ```javascript
  const fn = (param1: string, param2: number) => /* do something */;
  const decoratedFn = retryDecorator(
    fn,
    { delay:100, maxTry:5 }
  );
  const result1 = await decoratedFn("value1", 1);
  const result2 = await decoratedFn("valueXXX", 2);

  const fn = async (name: string): Promise<any> => { /* something async */ };
  const decoratedFn = retryAsyncDecorator(
    fn,
    { delay:100, maxTry:5 }
  );
  const result1 = await decoratedFn("Smith");
  const result2 = await decoratedFn("Doe");
  ```

- to wait:

  ```javascript
  await wait(10000); // Wait for 10 seconds
  ```

- to set a timeout:

  ```javascript
  try {
    const result = await waitUntil(() => {
      /* do something */
    }, 10000);
  } catch (err) {
    if (isTimeoutError(err)) {
      // fn does not complete after 10 seconds
    } else {
      // the function throws an exception
    }
  }
  ```

- to set a timeout on something async:

  ```javascript
  try {
    const result = await waitUntilAsync(async () => {
      /* do something */
    }, 10000);
  } catch (err) {
    if (isTimeoutError(error)) {
      // fn does not complete after 10 seconds
    } else {
      // fn throws an exception
    }
  }
  ```

- Need to call a function at multiple locations with the same retryOptions? Use decorators:

  ```javascript
    const fn = (title: string, count: number) => /* a long task */;
    const decoratedFn = waitUntilDecorator(
      fn,
      { delay:100, maxTry:5 }
    );
    const result1 = await decoratedFn("Intro", 1);
    const result2 = await decoratedFn("A chapter", 2);
  ```

  ```javascript
  const fn = async (name: string): Promise<any> => {
    /* a long task */
  };
  const decoratedFn = waitUntilAsyncDecorator(fn, { delay: 100, maxTry: 5 });
  const result1 = await decoratedFn("John");
  const result2 = await decoratedFn("Doe");
  ```

---

## Utils

`retry` comes with handy utility functions for common use cases:

- to retry until a function returns something defined (i.e., not null nor undefined):

```typescript
  // in all cases the result is a string and cannot be null or undefined
  const result = await retryUntilDefined( (): string|undefined => { ... } );

  const result = await retryUntilAsyncDefined( (): Promise<string|null> => { ... } );

  const decorated = retryUntilDefinedDecorator( (p1: string): string|undefined => { ... } );
  const result = await decorated('hello world');

  const decorated = retryAsyncUntilDefinedDecorator( (p1: string): Promise<string|undefined> => { ... } );
  const result = await decorated('hello world');
```

- to retry until a function returns something truthy:

```typescript
  // in all cases the result is a string and cannot be null or undefined
  const result = await retryUntilTruthy( (): boolean|undefined => { ... } );

  const result = await retryAsyncUntilTruthy( (): Promise<number|null> => { ... } );

  const decorated = retryUntilTruthyDecorator( (p1: string): boolean|undefined => { ... } );
  const result = await decorated('hello world');

  const decorated = retryAsyncUntilTruthyDecorator( (p1: string): Promise<boolean|null> => { ... } );
  const result = await decorated('hello world');
```

- to retry until fetch is successful:

```typescript
  const result = await retryAsyncUntilResponse( () => fetch(...) );

  const decorated = retryAsyncUntilResponseDecorator( (param) => fetch(...) );
  const result = await decorated('q=1');
```

---

## API

### Retry family

- `retry(fn, retryOptions?)`: call repeatedly `fn` until `fn` does not throw an exception. Stop after the `retryOptions.maxTry` count. Between each call wait `retryOptions.delay` milliseconds.
  If we stop calling fn after `retryOptions.maxTry`, throw the `fn` exception, otherwise return the fn return value.
- `retryAsync(fn, retryOptions?)`: same as retry, except `fn` is an asynchronous function.
- `retryOptions`:
  - `maxTry`: [optional] maximum calls to fn.
  - `delay`: [optional] delay between each call (in milliseconds). Could be either a number or a function (when delay time depends on the number of retries, or previous result...), see below for explanation about delay
  - `until`: [optional] (lastResult) => boolean: return false if the last `fn` result is not the expected one: continue calling fn until `until` returns true. A `TooManyTries` is thrown after `maxTry` calls to fn;
  - `onError`: [optional](err: Error, currentTry: number) => boolean | void: called on each error except the last one. Includes the current try for logging. Return `true` or nothing to continue retries, `false` to abort and throw `AbortError`. To catch/log the last error, use onMaxRetryFunc
- `onMaxRetryFunc`: [optional](err: Error) => void: called on the final error at the maxTry limit only
- `onSuccess`: [optional](currentTry: number) => void: called on success. Includes the current try for logging
  When an option value is not provided, the default one is applied. The default options are:

```javascript
  delay: 250,
  maxTry: 4 * 60,
```

- `setDefaultRetryOptions<T>(retryOptions: RetryOptions<T>)`: change the default retryOptions.
- `getDefaultRetryOptions<T>()`: returns the current default retry options.
- `retryAsyncDecorator<T>(fn: T, retryOptions?: RetryOptions<T>)` and `retryDecorator<T>(fn: T, retryOptions?: RetryOptions<T>)`: decorators that return a function with the same signature as the given function. On decorated call, fn is called repeatedly until it does not throw an exception or until retryOptions.maxTry.
- `TooManyTries`: an error thrown by retry functions when `until` returns false after `maxTry` calls. It comes with a type guard and includes the last failed result:

```javascript
if (isTooManyTries(error)) {
  // retry failed
  console.error(`last error is ${error.getLastResult()}`);
}
```

- `AbortError`: an error thrown when retries are aborted via `onError` returning `false`. It comes with methods to access the last error and attempt number:

```javascript
if (isAbortError(error)) {
  // retry aborted
  console.error(
    `Aborted at attempt ${error.getCurrentTry()}, last error: ${error.getError()}`,
  );
}
```

### When delay can vary

When delay option is a function, it is called before each retry: this allows having a delay that can change between retries (e.g., delay can increase exponentially).
The function receives the following parameters:

```javascript
(parameter: {
  currentTry: number,
  maxTry: number,
  lastDelay?: number
  lastResult?: RETURN_TYPE
}) => number;
```

where:

- `currentTry`: the number of calls to fn (first is 1, not 0).
- `maxTry`: maximum calls to fn.
- `lastDelay`: the previous delay, undefined when no delay has been computed yet.
- `lastResult`: the last result, undefined if the last call to fn failed

## Until family

`retry` comes with handy utility functions for common use cases:

**UntilDefined :**
To retry until we get a value which is neither null nor undefined.

For calling sync function:

```typescript
retryUntilDefined<RETURN_TYPE>(
  fn: () => RETURN_TYPE | undefined | null,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE>
```

```typescript
retryUntilDefinedDecorator<PARAMETERS_TYPE, RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE | undefined | null,
  retryOptions?: RetryUtilsOptions,
): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>
```

For calling async function:

```typescript
retryAsyncUntilDefined<RETURN_TYPE>(
  fn: () => Promise<RETURN_TYPE | undefined | null>,
  options?: RetryUtilsOptions,
): Promise<RETURN_TYPE>
```

```typescript
retryAsyncUntilDefinedDecorator<PARAMETERS_TYPE, RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE | undefined | null>,
  retryOptions?: RetryUtilsOptions,
): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>
```

**UntilTruthy :**
To retry until we get a value which JavaScript considers truthy.

For calling sync function:

```typescript
retryUntilTruthy<PARAMETERS_TYPE, RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE>
```

```typescript
retryUntilTruthyDecorator<PARAMETERS_TYPE, RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE,
  retryOptions?: RetryUtilsOptions,
): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>
```

For calling async function:

```typescript
retryAsyncUntilTruthy<PARAMETERS_TYPE, RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE>
```

```typescript
retryAsyncUntilTruthyDecorator<PARAMETERS_TYPE, RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>,
  retryOptions?: RetryUtilsOptions,
): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>
```

**UntilResponse :**
To retry until fetch is sucessfull.

```typescript
retryAsyncUntilResponse<PARAMETERS_TYPE, RETURN_TYPE extends { ok: boolean }>(
  fn: () => Promise<RETURN_TYPE>,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE>
```

```typescript
retryAsyncUntilResponseDecorator<PARAMETERS_TYPE, RETURN_TYPE extends { ok: boolean }>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>,
  retryOptions?: RetryUtilsOptions,
): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>
```

`RetryUtilsOptions` type is the same as `RetryOptions` but without the `until` option.

## Delay family

**createExponentialDelay**
Returns a delay function that provides exponential delays.

```javascript
const delay = createExponentialDelay(20);
const result = await retryAsync(
  async () => {
    /* do something */
  },
  { delay, maxTry: 5 },
);
```

delay between each try will return 20, 400, 8000, 160000, 3200000

**createMultiplicativeDelay**
Returns a delay function that provides multiplicative delays:

```typescript
createMultiplicativeDelay<RETURN_TYPE>(initialDelay: number, multiplicator: number)
```

First delay returns initialDelay, second initialDelay*multiplicator, third multiplicator * initialDelay _ (multiplicator _ 2) and so on

```javascript
const delay = createMultiplicativeDelay(20);
const result = await retryAsync(
  async () => {
    /* do something */
  },
  { delay, maxTry: 5 },
);
```

delay will be 20, 60, 120, 180, 240

**createRandomDelay**
Returns a delay function that provides random delays between given min and max (included):

```typescript
createRandomDelay<RETURN_TYPE>(min: number, max: number)
```

Each time the created delay is called, a value between min and max (both included) is generated

```javascript
const delay = createRandomDelay(500, 10000);
const result = await retryAsync(
  async () => {
    /* do something */
  },
  { delay, maxTry: 5 },
);
```

delay between each try will be a random value between 500 and 10000 ms.

## Wait family

- `wait(duration?)`: Does nothing for "duration" milliseconds
- `waitUntil(fn, duration?, error?)`: waitUntil calls fn asynchronously once. If fn completes within the duration (expressed in milliseconds), waitUntil returns the fn result. Otherwise, it throws the given error (if any) or a TimeoutError exception.
- `waitUntilAsync(fn, duration?, error?)`: same as waitUntil, except fn is an asynchronous function.
- `TimeoutError`: an error thrown by waitUntil and waitUntilAsync. It comes with a isTimeoutError type guard:

```javascript
if (isTimeoutError(error)) {
  // fn does not complete within 10 seconds
}
```

In case of timeout fn is still executing. It is advised to add a mean to abort it.

- When duration is not provided, the default one is applied. The default is 60000ms.
- `setDefaultDuration(duration: number)`: change the default duration.
- `getDefaultDuration()`: returns the current default duration.
- `waitUntilAsyncDecorator(fn: T, duration?: number, error?: Error)` and `waitUntilDecorator(fn: T, duration?: number, error?: Error)`: decorators that return a function with same signature than the given function. On decorated call, fn is called bounded to the duration.

## Custom reaction when max retry is achieved

Sometimes, you need to perform some actions when max retry has achieved and the error is still there. For this `onMaxRetryFunc?: (err: Error) => void;` optional function was added to `RetryOptions`.
For example, you would like to store results of the error into the file in order to process it later. Here's how you can do it :

```typescript
export const runWithRetry = <T>(
  message: string,
  serviceUnderTest: ServiceUnderTest,
  fn: () => T | Promise<T>,
  delay = 1000,
  maxTry = 10,
) => {
  const saveErrorReport = (err) => {
    const errorDetails = {
      serviceName: serviceUnderTest.connectorName,
      error: err.message as string,
      description: `Failed to ${message} because of ${err.message as string}`,
      errorName: err.name as string,
      stack: err.stack as string,
    };
    const path = resolve(
      __dirname,
      `../../../failed-service-report/${serviceUnderTest.connectorName}.json`,
    );
    writeFile(path, Buffer.from(JSON.stringify(errorDetails)));
  };
  return retryAsync(
    async () => {
      logger.info(`${serviceUnderTest.description}: ${message}`);
      return fn();
    },
    {
      delay,
      maxTry,
      onMaxRetryFunc: saveErrorReport,
    },
  );
};
```

## Compatibility

This lib works with Deno (to import it,use the url `https://raw.githubusercontent.com/franckLdx/ts-retry/<version>/src/index.ts`). However, it's more convenient to use the specific port of this lib to Deno: see `https://deno.land/x/retry`
