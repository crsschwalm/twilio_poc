export default class DataValidationError extends Error {
  constructor(...args: any[]) {
    super(...args);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DataValidationError);
    }
  }
}
