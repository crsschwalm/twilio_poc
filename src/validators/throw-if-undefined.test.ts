import { throwIfUndefined } from "./throw-if-undefined";
import DataValidationError from "./data-validation.error";

describe("throwIfUndefined", () => {
  it("throws if any value is undefined", () => {
    expect(() =>
      throwIfUndefined({ a: 1, b: undefined, c: undefined })
    ).toThrowError(new DataValidationError("Values for [b, c] are undefined."));
  });

  it("returns the same object if all values are defined", () => {
    expect(throwIfUndefined({ a: 1, b: 2, c: 3 })).toEqual({
      a: 1,
      b: 2,
      c: 3
    });
  });
});
