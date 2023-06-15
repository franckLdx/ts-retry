# ts-retry

A little retry tool to execute a function until the function is successful. Can also bind a timeout to a function.
This lib is usable in typescript, in javascript, in node, in SPA tools (rest, Vue, Svelte...) and browser (available in ESM and common js format).

---

**Breaking change**:
To migrate to 3.x: retryAsyncDecorator and retryAsync ahs been move in utils/decorators. These impact only
those that import those functions directly from decorator.ts file
Other 3.X items are new and implies no breaking change.

For those who are using 1.x in **typescript**, you may have to add a type to RetryOptions if you want to use
the new `until`function. This type is the called function returns type.

---

## How to

- to retry something:

  ```javascript
  const result = await retry(
    () => {
      /* do something */
    },
    { delay: 100, maxTry: 5 }
  );
  ```

- to retry something async :

  ```javascript
  const result = await retryAsync(
    async () => {
      /* do something */
    },
    { delay: 100, maxTry: 5 }
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
      }
    );
  } catch (err) {
    if (isTooManyTries(err)) {
      // Did not get 42 after 'maxTry' calls
    } else {
      // something else goes wrong
    }
  }
  ```

- Need to call a function at multiple locations with same retryOptions ? Use decorators:

  ```javascript
  const fn = (param1: string, param2:number) => /* do something */;
  const decoratedFn = retryDecorator(
    fn,
    { delay:100, maxTry:5 }
  );
  const title1 = await decoratedFn("value1", 1);
  const title2 = await decoratedFn("valueXXX", 2);

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
    const result = await waitUntil(
      async ()=> {/* do something */},
      10000
    );
  } catch (err) {
    if (isTimeoutError(error)) { {
      // fn does not complete after 10 seconds
    } else {
      // fn throws an exception
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

- Need to call a function at multiple locations with same retryOptions ? Use decorators:

  ```javascript
    const fn = (title: string, count:number) => /* a long task */;
    const decoratedFn = waitUntilDecorator(
      fn,
      { delay:100, maxTry:5 }
    );
    const title1 = await decoratedFn("Intro", 1);
    const title2 = await decoratedFn("A chapter", 2);
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

`retry` comes with handy utilities function for common use case:

- to retry until a function returns something defined (aka not null neither not undefined):

```typescript
  // in all cases results is a string and cannot be null or undefined
  const result = await retryUntilDefined( (): string|undefined => { ... } ) );

  const result = await retryUntilAsyncDefined( (): Promise<string|null> => { ... } );

  const decorated = retryUntilDefinedDecorator( (p1: string): string|undefined => { ... } );
  const result = await decorated('hello world');

  const decorated = retryAsyncUntilDefinedDecorator( (p1: string): Promise<string|undefined> => { ... } );
  const result = await decorated('hello world');
```

- to retry until a function returns something truthy:

```typescript
  // in all cases results is a string and cannot be null or undefined
  const result = await retryUntilTruthy( (): boolean|undefined => { ... } ) );

  const result = await retryAsyncUntilTruthy( (): Promise<number|null> => { ... } );

  const decorated = retryUntilTruthyDecorator( (p1: string): boolean|undefined => { ... } );
  const result = await decorated('hello world');

  const decorated = retryAsyncUntilTruthyDecorator( (p1: string): Promise<boolean|null> => { ... } );
  const result = await decorated('hello world');
```

- to retry until fetch is successfully:

```typescript
  const result = await retryAsyncUntilResponse( () => fetch(...) );

  const decorated = retryAsyncUntilResponseDecorator( (param) => fetch(...) );
  const result = await decorated('q=1');
```

---

## API

### Retry family

- `retry(fn, retryOptions?)`: call repeatedly `fn` until `fn` does not throw an exception. Stop after `retryOptions.maxTry` count. Between each call wait `retryOptions.delay` milliseconds.
  if stop to call fn after `retryOptions.maxTry`, throws `fn` exception, otherwise returns fn return value.
- `retryAsync(fn, retryOptions?)`: same as retry, except `fn` is an asynchronous function.
- `retryOptions`:
  - `maxTry`: [optional] maximum calls to fn.
  - `delay`: [optional] delay between each call (in milliseconds). Could be either a number or a function (when delay time dependent from number of retrys, of previous result...), see below for explanation about delay
  - `until`: [optional] (lastResult) => boolean: return false if last `fn` results is not the expected one: continue to call fn until `until` returns true. A `TooManyTries` is thrown after `maxTry` calls to fn;
  - `onError`: [optional](err: Error) => void: called on each error except the last one. To catch/log the last error use onMaxRetryFunc
    When an option value is not provided, the default one is applied. The default options are:

  ```javascript
    delay: 250,
    maxTry: 4 * 60,
  ```

- `setDefaultRetryOptions<T>(retryOptions: RetryOptions<T>)`: change the default retryOptions.
- `getDefaultRetryOptions<T>()`: returns the current default retry options.
- `retryAsyncDecorator<T>(fn: T, retryOptions?: RetryOptions<T>)` and `retryDecorator<T>(fn: T, retryOptions?: RetryOptions<T>)`: decorators that return a function with same signature than the given function. On decorated call, fn is called repeteadly it does not throw an exception or until retryOptions.maxTry.
- `TooManyTries`: an error thrown by retry functions when `until` returns false after `maxTry` calls. It comes with a type guard and includes the last failed result:

```javascript
if (isTooManyTries(error)) {
  // retry failed
  console.error(`last error is ${error.getLastResult()}`)
}
```

### When delay can vary

When delay option is a function, it is called before each retry: this allow to have a delay that can change between retires (ex: delay can increase exponentially).
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

- `currentTry`: the number of call to fn (first is 1, not 0).
- `maxTry`: maximum calls to fn.
- `lastDelay`: the previous delay, undefined when no delay has been computed yet.
- `lastResult`: the last result, undefined is last call to fn failed

## Until family

`retry` comes with handy utilities function for common use case:

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
To retry until we get a value which javascript consider as truthy.

For calling sync function:

```typescript
retryUntilTruthy<PARAMETERS_TYPE, RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE>
```

```typescript
retryUntilTruthyDecorator<PARAMETERS_TYPE,  RETURN_TYPE>(
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

`RetryUtilsOptions` type is the same than `RetryUtilsOptions` but without `until` option.

## Delay family

**createExponetialDelay**
Returns a delay function that provide exponetial delais

```javascript
const delay = createExponetialDelay(20);
const result = await retryAsync(
  async () => {
    /* do something */
  },
  { delay, maxTry: 5 }
);
```

delay between each try will return 20, 400, 8000, 160000, 3200000

**createMutiplicableDelay**
Returns a delay function that provide multiplicated delais:

```typescript
createMutiplicableDelay<RETURN_TYPE>(initialDelay: number, multiplicator: number)
```

First delay retunrs initialDelay, second initialDelay*multiplicator, third multiplicator initialDelay*(multiplicator\*2) and so on

```javascript
const delay = createMutiplicableDelay(20);
const result = await retryAsync(
  async () => {
    /* do something */
  },
  { delay, maxTry: 5 }
);
```

delay will be 20, 60, 120, 180, 240


**createRandomDelay**
Returns a delay function that provide radom delais between given min and max (included):

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
  { delay, maxTry: 5 }
);
```

delay betewwen each try will be a random value between 500 and 1000 ms.

## Wait family

- `wait(duration?)`: Do nothing during "duration" milliseconds
- `waitUntil(fn, duration?, error?)`: waitUntil call asynchronously fn once. If fn complete within the duration (express in milliseconds), waitUntil returns the fn result. Otherwise, it throws the given error (if any) or a TimeoutError exception.
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
  maxTry = 10
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
      `../../../failed-service-report/${serviceUnderTest.connectorName}.json`
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
    }
  );
};
```

## Compatibility

This lib works with Deno (to import it,use the url `https://raw.githubusercontent.com/franckLdx/ts-retry/<version>/src/index.ts`). However, it's more convenient to use the specific port of this lib to Deno: see `https://deno.land/x/retry`
