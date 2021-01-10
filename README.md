# ts-retry
A little retry tool to execute a function until the function is sucessfull. Can also bind a timeout to a function.
This lib is usable in javascript, in javascript, in node, SPA tools (rest, Vue, Svelte...) and browser (available in ESM and common js format). 

## How to:
* to retry something: 
  ```javascript
  const result = await retry(
    ()=> {/* do something */}, 
    { delay:100, maxTry:5}
  );
  ```
* to retry something async : 
  ```javascript
  const result = await retryAsync(
    async () => {/* do something */}, 
    { delay:100, maxTry:5}
  );
  ```
* to retry until the answer is 42 : 
  ```javascript
  try {
    await retryAsync(
      async () => {/* do something */}, 
      { 
        delay:100, 
        maxTry:5, 
        until: lastResult => lastResult===42 
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
* Need to call a function at multiple locations with same retryOptions ? Use decorators:
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
* to wait:
  ```javascript
  await wait(10000); // Wait for 10 seconds
  ```
* to set a timeout: 
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
* to set a timeout on something async:   
  ```javascript
  try {
    const result = await waitUntilAsync(
      async ()=> {/* do something */}, 
      10000
    );
  } catch (err) {
    if (isTimeoutError(error)) {
      // fn does not complete after 10 seconds
    } else {
      // fn throws an exception
    }
  }
  ```
* Need to call a function at multiple locations with same retryOptions ? Use decorators:
  ```javascript
    const fn = (title: string, count:number) => /* a long task */; 
    const decoratedFn = waitUntilDecorator(
      fn, 
      { delay:100, maxTry:5 }
    );
    const title1 = await decoratedFn("Intro", 1);
    const title2 = await decoratedFn("A chapter", 2);

    const fn = async (name: string): Promise<any> => { /* a long task */ }; 
    const decoratedFn = waitUntilAsyncDecorator(
      fn, 
      { delay:100, maxTry:5 }
    );
    const result1 = await decoratedFn("John");
    const result2 = await decoratedFn("Doe");
  ```

___
## API
### Retry familly
* `retry(fn, retryOptions?)`: call repeteadly fn until fn does not throw an exception. Stop after retryOptions.maxTry count. Between each call wait retryOptions.delay milliseconds.
if stop to call fn after retryOptions.maxTry, throws fn execption, otherwise returns fn return value.
* `retryAsync(fn, retryOptions?)`: same as retry, except fn is an asynchronous function.
* `retryOptions`:
  - maxTry: [optional] maximum calls to fn.
  - delay: [optional] delay between each call (in milliseconds).
  - until: [optional] (lastResult) => boolean: return false if last fn results is not the expected one: continue to call fn until `until` returns true. A `TooManyTries` is thrown after `maxTry` calls to fn; 
  When any option is not provided, the default one is applyed. The default options are
  ```
    delay: 250,  // call fn every 250 ms during one minute 
    maxTry: 4 * 60, 
    until: null
  ```
* `setDefaultRetryOptions(retryOptions: Partial<RetryOptions>)`: change the default retryOptions.
* `getDefaultRetryOptions()`: returns the current default retry options.
* `retryAsyncDecorator(fn: T, retryOptions?: RetryOptions)` and  `retryDecorator(fn: T, retryOptions?: RetryOptions)`: decorators that return a function with same signature than the given function. On decorated call, fn is called repeteadly it does not throw an exception or until retryOptions.maxTry. 
* `TooManyTries`: an error thrown by retry functions when `until` returns false after `maxTry` calls. It comes with a type guard: 
```javascript
  if (isTooManyTries(error)) {
    // fn does not complete within 10 seconds
  }
````
## Wait familly
* `wait(duration?)`: Do nothing during "duration" milliseconds
* `waitUntil(fn, duration?, error?)`: waitUntil call asynchronously fn once. If fn complete within the duration (express in miliseconds), waitUntil returns the fn result. Otherwhise it thows the given error (if any) or a TimeoutError exception.
* `waitUntilAsync(fn, duration?, error?)`: same as waitUntil, except fn is an asynchronous function.
* `TimeoutError`: an error thrown by waitUntil and waitUntilAsync. It comes with a isTimeoutError type guard:
```javascript
  if (isTimeoutError(error)) {
    // fn does not complete within 10 seconds
  }
```
In case of timeout fn is still executing. It is advise to add a mean to abort it.
* When duration is not provided, the default one is applyed. The default default is 60000ms.
* `setDefaultDuration(duration: number)`: change the default duration.
* `getDefaultDuration()`: returns the current default duration.
* `waitUntilAsyncDecorator(fn: T, duration?: number, error?: Error)` and `waitUntilDecorator(fn: T, duration?: number, error?: Error)`: decorators that return a function with same signature than the given function. On decorated call, fn is called bounded to the duration.


---
## Compatilibity
This lib works with Deno (to import it,use the url `https://raw.githubusercontent.com/franckLdx/ts-retry/<version>/src/index.ts`). However it's more convenient to use the specific port of this lib to Deno: see `https://deno.land/x/retry`
