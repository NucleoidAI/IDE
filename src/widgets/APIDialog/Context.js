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

const checkPath = (value) => {
  const path = value.match(/{\w*}/s);
  if (path) {
    return path[0].substring(1, path[0].length - 1);
  } else {
    return null;
  }
};

const updateParams = (api, oldPath, newPath, paramsRef) => {
  const oldResourceName = checkPath(oldPath.split("/").pop());
  const newResourceName = checkPath(newPath.split("/").pop());

  if (!oldResourceName && newResourceName) {
    const id = uuid();
    paramsRef.current[id] = {
      id,
      in: "path",
      name: newResourceName,
      required: true,
      type: "string",
      description: newResourceName + " path",
    };

    Object.keys(api)
      .filter((url) => url.includes(newPath))
      .map((url) => api[url])
      .forEach((item) => {
        Object.keys(item)
          .map((method) => item[method])
          .forEach((item) => {
            item.params.push({
              in: "path",
              name: newResourceName,
              required: true,
              type: "string",
              description: newResourceName + " path",
            });
          });
      });

    return; //res to path res
  }

  if (oldResourceName && !newResourceName) {
    Object.keys(paramsRef.current).forEach((id) => {
      if (paramsRef.current[id].name === oldResourceName) {
        delete paramsRef.current[id];
      }
    });

    Object.keys(api)
      .filter((url) => url.includes(newPath))
      .map((url) => api[url])
      .forEach((item) => {
        Object.keys(item)
          .map((method) => item[method])
          .forEach((item) => {
            item.params = item.params.filter(
              (param) => param.name !== oldResourceName
            );
          });
      });

    return; //path res to res
  }

  if (oldResourceName && newResourceName) {
    Object.keys(paramsRef.current).forEach((id) => {
      if (paramsRef.current[id].name === oldResourceName) {
        paramsRef.current[id].name = newResourceName;
        paramsRef.current[id].description = newResourceName + " path";
      }
    });

    Object.keys(api)
      .filter((url) => url.includes(newPath))
      .map((url) => api[url])
      .forEach((item) => {
        Object.keys(item)
          .map((method) => item[method])
          .forEach((item) => {
            const pathParam = item.params.find(
              (param) => param.name === oldResourceName
            );
            pathParam.name = newResourceName;
            pathParam.description = newResourceName + " path";
          });
      });

    return; //path res rename
  }
};

const compile = (schema) => {
  const { properties, items, $ref, type, ...other } = schema || {};
  const ref = $ref && $ref.split("/")[$ref.split("/").length - 1];

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
        const { type, $ref } = property;
        const ref = $ref && $ref.split("/")[$ref.split("/").length - 1];
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
            object[root].properties[id] = { id, name, type: type || ref };
          }
        }
      }

      break;
    default:
      if (schema) {
        object[root] = {
          id: root,
          type: type || ref,
        };
      }

      break;
  }

  return object;
};

const decompile = (schema) => {
  if (!schema[Object.keys(schema)[0]]) return {};

  const { type, properties, items, ...other } = schema[Object.keys(schema)[0]];
  const object = { ...other, type, properties: {}, items: {} };

  switch (type) {
    case "array":
      {
        delete object.name;
        const nested = decompile({ root: items[Object.keys(items)[0]] });
        object.items = nested;
        delete object.properties;
        delete object.id;
      }

      break;

    case "object":
      delete object.items;
      delete object.id;
      delete object.name;

      for (const key in properties) {
        const property = properties[key];

        const { name, type } = property;

        if (property.type === "object") {
          delete object.name;
          const nested = decompile({ root: property });
          object.properties[name] = nested;
        } else {
          object.properties[name] = { type };

          if (property.type === "array") {
            object.properties[name] = { type };
            const nested = decompile({ root: property });
            object.properties[name] = nested;
          } else {
            // TODO refactor here

            let tp = "type";
            if (type !== "integer" && type !== "string" && type !== "boolean") {
              tp = "$ref";
              object.properties[name] = {
                [tp]: "#/components/schemas/" + type,
              };
            } else {
              object.properties[name] = { type };
            }
          }
        }
      }

      break;
    default: {
      // TODO refactor here
      let tp = "type";
      if (type !== "integer" && type !== "string" && type !== "boolean") {
        tp = "$ref";
        object[tp] = "#/components/schemas/" + type;
        delete object.type;
      } else {
        object[tp] = type;
      }
      delete object.name;
      delete object.id;
      delete object.properties;
      delete object.items;
    }
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

export {
  updatePath,
  updateParams,
  checkPath,
  compile,
  decompile,
  index,
  deindex,
};
