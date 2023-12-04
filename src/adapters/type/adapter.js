const toOpenApiSchema = (schema) => {
  if (typeof schema !== "object" || schema.type === "ref") {
    return schema;
  }

  const { type, properties, ...other } = schema;
  const object = { ...other, type, properties: {}, items: {} };

  switch (type) {
    case "array":
      {
        delete object.name;
        const nested = toOpenApiSchema(schema.properties[0]);
        object.items = nested;
        delete object.properties;
        delete object.id;
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
              object.properties[name] = { type };
            }
          }
        }
      }
      break;
    case "ref": {
      return object;
    }
    default:
      break;
  }

  return object;
};

const toApi = (api) => {
  const paths = {};

  api.forEach((method) => {
    if (!paths[method?.path]) paths[method?.path] = {};
    paths[method?.path][method?.method?.toLowerCase()] = {
      summary: method?.summary,
      description: method?.description,
      "x-nuc-action": method["x-nuc-action"],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: { ...toOpenApiSchema(method?.response?.schema) },
            },
          },
        },
        400: {
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
      requestBody: {
        content: {
          "application/json": {
            schema: { ...toOpenApiSchema(method?.request?.schema) },
          },
        },
      },
    };
  });
  return paths;
};

const toSchemas = (types) => {
  const schemas = {};
  types.forEach((type) => {
    schemas[type?.name] = toOpenApiSchema(type?.schema);
  });

  return schemas;
};

const toOpenApi = ({ api, types }) => {
  const openapi = {};

  openapi.paths = toApi(api);
  openapi.components = { schemas: toSchemas(types) };

  return openapi;
};

export { toOpenApiSchema, toOpenApi };
