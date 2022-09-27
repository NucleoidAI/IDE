function deepCopy(inObject) {
  let value, key;

  if (typeof inObject !== "object" || inObject === null) {
    return inObject;
  }

  const outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    value = inObject[key];

    outObject[key] = deepCopy(value);
  }

  return outObject;
}

export { deepCopy };
