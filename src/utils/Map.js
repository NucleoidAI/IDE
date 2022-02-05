function compile(object) {
  let map = {};
  object = object[Object.keys(object)[0]];
  if (!object) return {};

  const { id, properties } = object;
  map[id] = object;

  for (const key in properties) {
    const property = properties[key];
    const { id, type } = property;

    if (type === "object") {
      map = { ...map, ...compile({ property }) };
    } else {
      map[id] = property;
    }
  }

  return map;
}

export { compile };
