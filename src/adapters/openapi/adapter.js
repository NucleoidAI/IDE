const toOpenApiSchema = (schema, types) => {
  if (typeof schema !== "object") {
    return schema;
  }

  const { type, properties, ref, ...other } = schema;
  const object = { ...other, type, properties: {}, items: {}, ref };

  switch (type) {
    case "array": {
      delete object.name;
      const nested = toOpenApiSchema(schema.properties[0], types);
      object.items = nested;
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
          const nested = toOpenApiSchema(property, types);
          object.properties[name] = nested;
        } else {
          if (property.type === "array") {
            const nested = toOpenApiSchema(property, types);
            object.properties[name] = nested;
          } else {
            if (types && types.find((t) => t.name === type)) {
              object.properties[name] = {
                $ref: `#/components/schemas/${type}`,
              };
            } else if (type === "ref") {
              object.properties[name] = {
                $ref: `#/components/schemas/${property.ref}`,
              };
            } else {
              object.properties[name] = { type };
            }
          }
        }
      }
      break;
    }
    default: {
      if (types && types.find((t) => t.name === type)) {
        object["$ref"] = `#/components/schemas/${type}`;
        delete object.type;
      } else if (type === "ref") {
        object["$ref"] = `#/components/schemas/${ref}`;
        delete object.type;
      } else {
        object["type"] = type;
      }
      delete object.name;
      delete object.id;
      delete object.properties;
      delete object.items;
      delete object.ref;
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
    schemas[type?.name] = toOpenApiSchema(type?.schema);
  });

  return schemas;
};

const toOpenApi = ({ api, types, functions, declarations }) => {
  const openapi = {
    openapi: {
      paths: toPaths(api, types),
      components: { schemas: toSchemas(types) },
      "x-nuc-action": "start",
      "x-nuc-functions": functions,
      "x-nuc-declarations": declarations,
    },
  };
  return openapi;
};

export { toOpenApiSchema, toOpenApi };
