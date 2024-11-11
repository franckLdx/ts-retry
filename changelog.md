# 6.0.0

onError function may now return boolean:
  - when returning nothing (behavior until 5.x): retries continue
  - when returnin true, retries continue
  - when returning flase, retries stops and an AbortError is thrown

AbortError:
  An error thrown when reties are aborted due to an exception
  getError return the last error
  getCurrentTry the aborte try

# 5.0.1

Fix missing exports: retryDecorator a retryAsyncDecorator

# 5.0.0

Update dependencies to fix testing, 

Breaking changes: add attempt data to onError & onSuccessFunc
function for logging purposes

# 4.2.5

Update dependencies

# 4.2.4

Update dependencies & Fix readme

# 4.2.3

Update dependencies

# 4.2.2

Update dependencies & export retryAsyncUntilDefined

# 4.2.1

Addexport of retryUntilDefined and retryAsyncUntilDefinedDecorator

# 4.2.0

Add onError to RetryOptions Remove browser entry from package.json, its an issue
for reac-native project

# 4.1.2

Update deps Fix export: add createExponetialDelay, createMutiplicableDelay and
createRandomDelay

# 4.1.1

Update deps

# 4.1.0

createRandomDelay added

# 4.0.0

ToomanyRetries now contains last error. Therefore is is typed with RETURN_TYPE.
This can lead to typescript error, hence the major release. There's no other
breaking change.

# 3.0.0

retryAsyncDecorator and retryAsync has been move in utils/decorators.

# 2.5.0

Delay option can be a function: therefore del y cn vary between each retry

# 2.4.5

Update dependencies

# 2.4.4

Update dependencies

# 2.4.3

Update dependencies
