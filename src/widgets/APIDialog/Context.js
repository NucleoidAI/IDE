import { v4 as uuid } from "uuid";

const updatePath = (object, oldPath, newPath) => {
  Object.keys(object).forEach((objectName) => {
    if (objectName.includes(oldPath)) {
      const objectValue = { ...object[objectName] };
      delete object[objectName];
      objectName = objectName.replace(oldPath, newPath);

      object[objectName] = { ...objectValue };
    }
  });
};

const compile = (schema) => {
  const { properties, items, type, ...other } = schema || {};
  const root = uuid();
  const object = {};

  switch (type) {
    case "array":
      {
        object[root] = {
          ...other,
          id: root,
          type: type ? type : "array",
          items: {},
        };

        const nested = compile(items, "array");
        const key = Object.keys(nested)[0];

        object[root].items[key] = { ...nested[key] };
      }
      break;
    case "object":
      object[root] = {
        ...other,
        id: root,
        type: type ? type : "object",
        properties: {},
      };

      for (const name in properties) {
        const property = properties[name];
        const { type } = property;
        const id = uuid();

        if (property.type === "object") {
          const nested = compile(property);
          const key = Object.keys(nested)[0];
          object[root].properties[key] = { name, ...nested[key] };
        } else {
          if (type === "array") {
            const nested = compile(property, "object");
            const key = Object.keys(nested)[0];

            object[root].properties[id] = {
              id: id,
              name: name,
              ...nested[key],
            };
          } else {
            object[root].properties[id] = { id, name, type };
          }
        }
      }

      break;
    default:
      //TODO check in global types
      if (schema) {
        object[root] = {
          id: root,
          type: schema.type,
        };
      }

      break;
  }

  return object;
};

const decompile = (schema) => {
  const { type, properties, items, ...other } = schema[Object.keys(schema)[0]];
  const object = { ...other, type, properties: {}, items: {} };

  switch (type) {
    case "array":
      {
        const nested = decompile({ root: items[Object.keys(items)[0]] });
        object.items = nested;
        delete object.properties;
        delete object.id;
        delete object.name;
      }

      break;

    case "object":
      delete object.items;
      delete object.id;
      delete object.name;
      for (const key in properties) {
        const property = properties[key];

        const { name, type } = property;

        if (type === "object") {
          const nested = decompile({ root: property });
          object.properties[name] = nested;
        } else {
          object.properties[name] = { type };

          if (type === "array") {
            const nested = decompile({ root: property });
            object.properties[name].items = nested;
          }
        }
      }

      break;
    default:
  }

  return object;
};

const index = (list) => {
  const object = {};
  if (!list) return object;

  for (const item of list) {
    const id = uuid();
    object[id] = { id, ...item };
  }

  return object;
};

const deindex = (list) =>
  Object.values(list)
    .filter((item) => item.name)
    .map((item) => {
      delete item.id;
      return item;
    });

export { updatePath, compile, decompile, index, deindex };
