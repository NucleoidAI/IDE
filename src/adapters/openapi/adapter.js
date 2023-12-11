const toOpenApiSchema = (schema) => {
  if (typeof schema !== "object") {
    return schema;
  }

  const { type, properties, ref, ...other } = schema;
  const object = { ...other, type, properties: {}, items: {}, ref };

  switch (type) {
    case "array":
      {
        delete object.name;
        const nested = toOpenApiSchema(schema.properties[0]);
        object.items = nested;
        delete object.properties;
      }
      break;
    case "object":
      {
        delete object.items;
        delete object.name;

        for (const key in properties) {
          const property = properties[key];
          const { name, type } = property;

          if (property.type === "object") {
            delete object.name;
            const nested = toOpenApiSchema(property);
            object.properties[name] = nested;
          } else {
            if (property.type === "array") {
              const nested = toOpenApiSchema(property);
              object.properties[name] = nested;
            } else {
              if (type === "ref") {
                object.properties[name] = {
                  $ref: "#/components/schemas/" + property.ref,
                };
              } else {
                object.properties[name] = { type };
              }
            }
          }
        }
      }
      break;
    default:
      {
        if (type === "ref") {
          object["$ref"] = `#/components/schemas/${object.ref}`;
          delete object.type;
        } else {
          object["type"] = type;
        }
        delete object.name;
        delete object.id;
        delete object.properties;
        delete object.items;
        delete object.ref;
      }
      break;
  }

  return object;
};

const toPaths = (api) => {
  const paths = {};

  api.forEach((method) => {
    if (!paths[method?.path]) paths[method?.path] = {};
    paths[method?.path][method?.method?.toLowerCase()] = {
      summary: method?.summary || "",
      description: method?.description || "",
      "x-nuc-action": method["x-nuc-action"],
      responses: {
        200: {
          description: "Successful Operation",
          content: {
            "application/json": {
              schema: { ...toOpenApiSchema(method?.response?.schema) },
            },
          },
        },
        400: {
          description: "Successful Operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { message: { type: "string" } },
              },
            },
          },
        },
      },
      requestBody: method?.request?.schema && {
        content: {
          "application/json": {
            schema: { ...toOpenApiSchema(method?.request?.schema) },
          },
        },
      },
      parameters: [],
      request: undefined,
      response: undefined,
      action: undefined,
      params: undefined,
    };
  });
  return paths;
};

const toSchemas = (types) => {
  if (!types) {
    return types;
  }
  const schemas = {};
  types.forEach((type) => {
    schemas[type?.name] = toOpenApiSchema(type?.schema);
  });

  return schemas;
};

const toOpenApi = ({ api, types }) => {
  const openapi = {};

  openapi.paths = toPaths(api);
  openapi.components = { schemas: toSchemas(types) };

  return openapi;
};

export { toOpenApiSchema, toOpenApi };
