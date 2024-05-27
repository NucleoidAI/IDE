import { toOpenApi } from "../adapters/openapi/adapter";

import {
  apiData,
  declarationsData,
  openApiData as expectedOpenApi,
  functionsData,
  nestedResourceApiData,
  nestedTypeData,
  singleResourceApiData,
  singleTypeData,
  typesData,
} from "./adapterTestData";

describe("OpenAPI Adapter", () => {
  test("should convert API definition, types, functions, and declarations to OpenAPI specification", () => {
    const actualOpenApi = toOpenApi({
      api: apiData,
      types: typesData,
      functions: functionsData,
      declarations: declarationsData,
    });
    expect(actualOpenApi).toEqual(expectedOpenApi);
  });

  test("should convert API and types (Single resource, single type)", () => {
    const expectedOpenApi = {};

    const actualOpenApi = toOpenApi({
      api: singleResourceApiData,
      types: singleTypeData,
    });

    expect(actualOpenApi).toEqual(expectedOpenApi);
  });

  test("should convert nested API and types (Nested resource and single type)", () => {
    const expectedOpenApi = {};

    const actualOpenApi = toOpenApi({
      api: nestedResourceApiData,
      types: singleTypeData,
    });

    expect(actualOpenApi).toEqual(expectedOpenApi);
  });

  test("should convert nested API and nested types (Nested resource and nested types)", () => {
    const expectedOpenApi = {};

    const actualOpenApi = toOpenApi({
      api: nestedResourceApiData,
      types: nestedTypeData,
    });

    expect(actualOpenApi).toEqual(expectedOpenApi);
  });

  test("should handle empty API definition", () => {
    const emptyApiDefinition = {};
    const customTypes = [];

    const actualOpenApiSpec = toOpenApi({
      api: emptyApiDefinition,
      types: customTypes,
    });

    expect(actualOpenApiSpec.paths).toEqual({});
  });

  test("should handle empty custom types", () => {
    const apiDefinition = {};
    const emptyCustomTypes = [];

    const actualOpenApiSpec = toOpenApi({
      api: apiDefinition,
      types: emptyCustomTypes,
    });

    expect(actualOpenApiSpec.components.schemas).toBeUndefined();
  });
});
