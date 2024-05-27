import { toOpenApi } from "../adapters/openapi/adapter";

import {
  apiData,
  declarationsData,
  openApiData as expectedFullOpenApi,
  expectedNestedResourceNestedTypesOpenApi,
  expectedNestedResourceSingleTypeOpenApi,
  expectedSingleResourceSingleTypeOpenApi,
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

    expect(actualOpenApi).toEqual(expectedFullOpenApi);
  });

  test("should convert API and types (Single resource, single type)", () => {
    const actualOpenApi = toOpenApi({
      api: singleResourceApiData,
      types: singleTypeData,
      functions: functionsData,
      declarations: declarationsData,
    });

    expect(actualOpenApi).toEqual(expectedSingleResourceSingleTypeOpenApi);
  });

  test("should convert nested API and types (Nested resource and single type)", () => {
    const actualOpenApi = toOpenApi({
      api: nestedResourceApiData,
      types: singleTypeData,
      functions: functionsData,
      declarations: declarationsData,
    });

    expect(actualOpenApi).toEqual(expectedNestedResourceSingleTypeOpenApi);
  });

  test("should convert nested API and nested types (Nested resource and nested types)", () => {
    const actualOpenApi = toOpenApi({
      api: nestedResourceApiData,
      types: nestedTypeData,
      functions: functionsData,
      declarations: declarationsData,
    });

    expect(actualOpenApi).toEqual(expectedNestedResourceNestedTypesOpenApi);
  });

  test("should handle empty API definition", () => {
    const emptyApiDefinition = [];

    const actualOpenApiSpec = toOpenApi({
      api: emptyApiDefinition,
      types: typesData,
      functions: functionsData,
      declarations: declarationsData,
    });

    expect(actualOpenApiSpec.openapi.paths).toEqual({});
  });

  test("should handle empty custom types", () => {
    const emptyCustomTypes = [];

    const actualOpenApiSpec = toOpenApi({
      api: apiData,
      types: emptyCustomTypes,
      functions: functionsData,
      declarations: declarationsData,
    });

    expect(actualOpenApiSpec.openapi.components.schemas).toEqual({});
  });
});
