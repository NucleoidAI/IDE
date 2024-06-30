// TODO Rename to OpenAPIAdapter in adapters folder
const toOpenApiSchema = (schema, types = []) => {
  if (typeof schema !== "object") {
    return schema;
  }

  const { type, properties, ...other } = schema;
  const object = { ...other, type, properties: {}, items: {} };

  switch (type) {
    case "array": {
      object.items = toOpenApiSchema(schema.items, types);
      delete object.properties;
      break;
    }
    case "object": {
      delete object.items;
      delete object.name;
      for (const key in properties) {
        const property = properties[key];
        const { name, type } = property;
        if (property.type === "object") {
          delete object.name;
          object.properties[name] = toOpenApiSchema(property, types);
        } else if (property.type === "array") {
          object.items = toOpenApiSchema(property.items, types);
        } else {
          if (types.find((t) => t.name === type)) {
            object.properties[name] = {
              $ref: `#/components/schemas/${type}`,
            };
          } else {
            object.properties[name] = { type };
          }
        }
      }
      break;
    }
    default: {
      if (types.find((t) => t.name === type)) {
        object["$ref"] = `#/components/schemas/${type}`;
        delete object.type;
      } else {
        object["type"] = type;
      }

      delete object.id;
      delete object.name;
      delete object.properties;
      delete object.items;
      break;
    }
  }

  return object;
};

const toPaths = (api, types) => {
  const paths = {};
  api.forEach((method) => {
    if (!paths[method?.path]) paths[method?.path] = {};
    paths[method?.path][method?.method?.toLowerCase()] = {
      summary: method?.summary || "",
      description: method?.description || "",
      "x-nuc-action": method["action"],
      responses: {
        200: {
          description: "Successful Operation",
          content: {
            "application/json": {
              schema: {
                ...toOpenApiSchema(method?.response?.schema, types),
              },
            },
          },
        },
        400: {
          description: "Successful Operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      requestBody: method?.request?.schema && {
        content: {
          "application/json": {
            schema: {
              ...toOpenApiSchema(method?.request?.schema, types),
            },
          },
        },
      },
      parameters: method?.params?.map(toOpenApiParameter) || [],
    };
  });
  return paths;
};

const toOpenApiParameter = (param) => {
  return {
    name: param.name,
    in: param.in,
    required: param.required,
    schema: {
      type: param.type,
    },
    description: param.description,
  };
};

const toSchemas = (types) => {
  if (!types) {
    return types;
  }
  const schemas = {};
  types.forEach((type) => {
    const schema = toOpenApiSchema(type?.schema, types);
    for (const key in schema.properties) {
      const property = schema.properties[key];
      if (types.find((t) => t.name === property.type)) {
        schema.properties[key] = {
          $ref: `#/components/schemas/${property.type}`,
        };
      }
    }
    schemas[type?.name] = schema;
  });
  return schemas;
};

const toOpenApi = ({ api, types, functions, declarations }) => {
  return {
    openapi: {
      paths: toPaths(api, types),
      components: { schemas: toSchemas(types) },
      "x-nuc-action": "start",
      "x-nuc-functions": functions,
      "x-nuc-declarations": declarations,
    },
  };
};

export { toOpenApiSchema, toOpenApi };
