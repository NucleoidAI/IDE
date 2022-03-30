function compile(object) {
  // TODO add test

  if (!object) return {};
  object = object[Object.keys(object)[0]];
  let map = {};

  const { id, properties, items, type } = object;

  map[id] = object;

  switch (type) {
    case "array": {
      const item = items[Object.keys(items)[0]];
      map = { ...map, ...compile({ root: item }) };
      break;
    }
    case "object": {
      for (const key in properties) {
        const property = properties[key];
        const { id, type } = property;

        if (type === "object" || type === "array") {
          map = { ...map, ...compile({ root: property }) };
        } else {
          map[id] = property;
        }
      }
      break;
    }
    default:
      break;
  }

  return map;
}

export { compile };
