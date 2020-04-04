# ts-retry
A little retry tool in javascript/typescript for node and for browser.

## How to:
* to retry something: <code>await retry(()=> {/* do something */}, {delay:100,maxTry:5})</code>
* to retry something async : <code>await retryAsync(async ()=> {/* do something */}, {delay:100,maxTry:5})</code>
* to wait 1OOms of milliseconds: <code>await wait(100)</code> 

Above examples make up to 5 attempts, waiting 100ms between each try.

## API
* retry(fn, retryOptions): call repeteadly fn until fn does not throw and exception. Stop after retryOptions.maxTry count. Between each call wait retryOptions.delay milliseconds.
if stop to call fn after retryOptions.maxTry, throws fn execption, otherwise returns fn return value.
* retryAsync(fn, retryOptions): same as retry, except fn is an asynchronous function.
* retryOptions:
  - maxTry maximum calls to fn.
  - delay: delay between each call (in milliseconds).
