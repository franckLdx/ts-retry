# ts-retry
A little retry tool in javascript/typescript for node and for browser.Ex:
```javascript
const result = await retryAsync(
  async ()=> {/* get some data if ready, throw an expection otherwise */}, 
  {delay:100,maxTry:5}
)
```
This will try 5 times to get the data. If data is not ready after the 5 attempts,
an exception is thrown. If data are obtained, retryAsync stop immediatly and returns
the data. 

## How to:
* to retry something: 
  ```javascript
  const result = await retry(()=> {/* do something */}, {delay:100,maxTry:5})
  ```
* to retry something async : 
  ```javascript
  const result = await retryAsync(async ()=> {/* do something */}, {delay:100,maxTry:5})
  ```
Above examples make up to 5 attempts, waiting 100ms between each try.

You can also wait for a number of seconds
* to wait 1OO 
ms of milliseconds: <br/><code>await wait(100)</code> 


## API
* retry(fn, retryOptions): call repeteadly fn until fn does not throw and exception. Stop after retryOptions.maxTry count. Between each call wait retryOptions.delay milliseconds.
if stop to call fn after retryOptions.maxTry, throws fn execption, otherwise returns fn return value.
* retryAsync(fn, retryOptions): same as retry, except fn is an asynchronous function.
* retryOptions:
  - maxTry maximum calls to fn.
  - delay: delay between each call (in milliseconds).

## Typescript:
The library comes with it's own .d.ts file. 

retry and retryAsync return type is the return type of the callback 
```javascript
  const get = (); boolean => /* do something that return a boolean */
  const result = await retryAsync>(get, {delay:100,maxTry:5}) /* result is a boolean */
```

# Deno
This lib works with Deno (to import it,use the url `https://raw.githubusercontent.com/franckLdx/ts-retry/<version>/src/index.ts`). However it's more convenient to use the specific port of this lib to Deno: see `https://deno.land/x/retry`
