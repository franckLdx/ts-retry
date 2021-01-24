import { retryAsyncUntiDecoratorHof } from "../hof";
import { retryAsyncUntilResponse } from "./retry";

export const retryAsyncUntilResponseDecorator = retryAsyncUntiDecoratorHof(
  retryAsyncUntilResponse,
);
