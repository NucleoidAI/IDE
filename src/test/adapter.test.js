import { toOpenApi } from "../adapters/openapi/adapter";

import {
  apiData,
  declarationsData,
  functionsData,
  nestedResourceApiData,
  nestedTypeData,
  singleResourceApiData,
  singleTypeData,
  typesData,
} from "./adapterTestData";

describe("OpenAPI Adapter", () => {
  test("converts API definition, types, functions, and declarations to OpenAPI specification", () => {
    const { openapi } = toOpenApi({
      api: apiData,
      types: typesData,
      functions: functionsData,
      declarations: declarationsData,
    });

    expect(
      openapi.paths["/"].get.responses["200"].content["application/json"].schema
    ).toEqual({
      type: "object",
      properties: {
        message: {
          type: "string",
        },
      },
    });
    expect(
      openapi.paths["/items"].get.responses["200"].content["application/json"]
        .schema
    ).toEqual({
      type: "array",
      items: {
        $ref: "#/components/schemas/Item",
      },
    });
    expect(
      openapi.paths["/items"].post.requestBody.content["application/json"]
        .schema
    ).toEqual({
      $ref: "#/components/schemas/Item",
    });
  });
});

test("should convert API and types (Single resource, single type)", () => {
  const { openapi } = toOpenApi({
    api: singleResourceApiData,
    types: singleTypeData,
    functions: functionsData,
    declarations: declarationsData,
  });
});

test("should convert nested API and types (Nested resource and single type)", () => {
  const { openapi } = toOpenApi({
    api: nestedResourceApiData,
    types: singleTypeData,
    functions: functionsData,
    declarations: declarationsData,
  });
});

test("should convert nested API and nested types (Nested resource and nested types)", () => {
  const { openapi } = toOpenApi({
    api: nestedResourceApiData,
    types: nestedTypeData,
    functions: functionsData,
    declarations: declarationsData,
  });
});

test("handles empty API definition", () => {
  const emptyApiDefinition = [];

  const actualOpenApiSpec = toOpenApi({
    api: emptyApiDefinition,
    types: typesData,
    functions: functionsData,
    declarations: declarationsData,
  });

  expect(actualOpenApiSpec.openapi.paths).toEqual({});
});

test("handles empty custom types", () => {
  const emptyCustomTypes = [];

  const actualOpenApiSpec = toOpenApi({
    api: apiData,
    types: emptyCustomTypes,
    functions: functionsData,
    declarations: declarationsData,
  });

  expect(actualOpenApiSpec.openapi.components.schemas).toEqual({});
});
