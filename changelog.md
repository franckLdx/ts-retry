# 6.0.0

onError function may now return boolean:

- when returning nothing (behavior until 5.x): retries continue
- when returning true, retries continue
- when returning false, retries stop and an AbortError is thrown

The behavior of previous releases is preserved. If you don't want to use this functionality you do not need to
do any change in your code

AbortError:
An error thrown when retries are aborted due to an exception
getError returns the last error
getCurrentTry returns the aborted try

# 5.0.2

Add exports for AbortError and isAbortError

# 5.0.1

Fix missing exports: retryDecorator and retryAsyncDecorator

# 5.0.0

Update dependencies to fix testing,

Breaking changes: added attempt data to onError & onSuccess functions
for logging purposes

# 4.2.5

Update dependencies

# 4.2.4

Update dependencies & Fix readme

# 4.2.3

Update dependencies

# 4.2.2

Update dependencies & export retryAsyncUntilDefined

# 4.2.1

Add export of retryUntilDefined and retryAsyncUntilDefinedDecorator

# 4.2.0

Add onError to RetryOptions. Remove browser entry from package.json, it's an issue
for React Native projects

# 4.1.2

Update deps. Fix export: add createExponentialDelay, createMultiplicativeDelay and
createRandomDelay

# 4.1.1

Update deps

# 4.1.0

createRandomDelay added

# 4.0.0

TooManyTries now contains last error. Therefore it is typed with RETURN_TYPE.
This can lead to TypeScript error, hence the major release. There's no other
breaking change.

# 3.0.0

retryAsyncDecorator and retryAsync has been moved to utils/decorators.

# 2.5.0

Delay option can be a function: therefore delay can vary between each retry

# 2.4.5

Update dependencies

# 2.4.4

Update dependencies

# 2.4.3

Update dependencies
