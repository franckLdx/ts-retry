# ts-retry
A little retry tool in javascript/typescript for node and for browser.Ex:<pre><code>
const result = await retryAsync(
        async ()=> {/* get some data if ready, throw an expection otherwise */}, 
        {delay:100,maxTry:5}
)
</code></pre>
This will try 5 times to get the data. If data is not ready after the 5 attempts,
an exception is thrown. If data are obtained, retryAsync stop immediatly and returns
the data. 

## How to:
* to retry something: <br/><code>const result = await retry(()=> {/* do something */}, {delay:100,maxTry:5})</code>
* to retry something async : <br/><code>const result = await retryAsync(async ()=> {/* do something */}, {delay:100,maxTry:5})</code><br/>
Above examples make up to 5 attempts, waiting 100ms between each try.

You can also wait for a number of seconds
* to wait 1OOms of milliseconds: <br/><code>await wait(100)</code> 


## API
* retry(fn, retryOptions): call repeteadly fn until fn does not throw and exception. Stop after retryOptions.maxTry count. Between each call wait retryOptions.delay milliseconds.
if stop to call fn after retryOptions.maxTry, throws fn execption, otherwise returns fn return value.
* retryAsync(fn, retryOptions): same as retry, except fn is an asynchronous function.
* retryOptions:
  - maxTry maximum calls to fn.
  - delay: delay between each call (in milliseconds).

## Typescript:
The library comes with it's own .d.ts file. 
The retry function is generic: you can specify the return type:<br/>
<pre><code>const result = await retryAsync<string>(async ()=> {/* do something */}, {delay:100,maxTry:5})</code><pre>