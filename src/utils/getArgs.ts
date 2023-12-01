export function getNullableBooleanArg(value?: boolean | null) {
  if (value === undefined) return undefined;
  if (value === true) return true;
  if (value === false) return false;
  if (value === null) return null;
  return undefined;
}

export function getBooleanArg(value?: boolean | null) {
  if (value === undefined) return undefined;
  if (value === true) return true;
  if (value === false) return false;
  return undefined;
}

export function getNullableStringArg(value?: string | null) {
  if (value === null) return null;
  if (value === "") return null;
  return value;
}

export function getStringArg(value?: string | null) {
  if (value === null) throw new Error("Value cannot be empty");
  if (value === "") throw new Error("Value cannot be empty");
  if (value === undefined) undefined;
  return value;
}

export function getNullableIntArg(value?: number | null) {
  if (value === null) return null;
  if (value === undefined) undefined;
  return value;
}

export function getIntArg(value?: number | null) {
  if (value === null) throw new Error("Value cannot be empty");
  if (value === undefined) undefined;
  return value;
}
