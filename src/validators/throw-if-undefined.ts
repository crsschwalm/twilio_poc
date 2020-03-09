import DataValidationError from "./data-validation.error";

export function throwIfUndefined<T>(params: Partial<T>): Required<T> {
  const undefinedKeys = Object.entries(params)
    .filter(isUndefined)
    .map(([key]) => key);

  if (undefinedKeys.length) {
    throw new DataValidationError(
      `Values for [${undefinedKeys.join(", ")}] are undefined.`
    );
  }

  return params as Required<T>;
}

function isUndefined<K, V>(entry: [K, V | undefined]): entry is [K, undefined] {
  return typeof entry[1] === "undefined";
}
