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
  const checkResponseSchema = (response) => {
    expect(response).toHaveProperty("description");
    expect(response.content).toHaveProperty("application/json");
    expect(response.content["application/json"]).toHaveProperty("schema");
  };

  const checkParameterSchema = (param) => {
    expect(param).toHaveProperty("name");
    expect(param).toHaveProperty("in");
    expect(param).toHaveProperty("required");
    expect(param).toHaveProperty("schema");
  };

  test("should convert API definition, types, functions, and declarations to OpenAPI specification", () => {
    const actualOpenApi = toOpenApi({
      api: apiData,
      types: typesData,
      functions: functionsData,
      declarations: declarationsData,
    });

    expect(Object.keys(actualOpenApi.openapi.paths).length).toBeGreaterThan(0);

    Object.values(actualOpenApi.openapi.paths).forEach((path) => {
      Object.values(path).forEach((method) => {
        expect(method).toHaveProperty("summary");
        expect(method).toHaveProperty("description");
        expect(method).toHaveProperty("responses");
        Object.values(method.responses).forEach(checkResponseSchema);
        method.parameters?.forEach(checkParameterSchema);
      });
    });

    expect(
      Object.keys(actualOpenApi.openapi.components.schemas).length
    ).toBeGreaterThan(0);

    expect(actualOpenApi.openapi).toHaveProperty(
      "x-nuc-functions",
      functionsData
    );
    expect(actualOpenApi.openapi).toHaveProperty(
      "x-nuc-declarations",
      declarationsData
    );
  });

  test("should convert API and types (Single resource, single type)", () => {
    const actualOpenApi = toOpenApi({
      api: singleResourceApiData,
      types: singleTypeData,
      functions: functionsData,
      declarations: declarationsData,
    });

    expect(Object.keys(actualOpenApi.openapi.paths).length).toBeGreaterThan(0);

    Object.values(actualOpenApi.openapi.paths).forEach((path) => {
      Object.values(path).forEach((method) => {
        expect(method).toHaveProperty("summary");
        expect(method).toHaveProperty("description");
        expect(method).toHaveProperty("responses");
        Object.values(method.responses).forEach(checkResponseSchema);
        method.parameters?.forEach(checkParameterSchema);
      });
    });

    expect(
      Object.keys(actualOpenApi.openapi.components.schemas).length
    ).toBeGreaterThan(0);
  });

  test("should convert nested API and types (Nested resource and single type)", () => {
    const actualOpenApi = toOpenApi({
      api: nestedResourceApiData,
      types: singleTypeData,
      functions: functionsData,
      declarations: declarationsData,
    });

    expect(Object.keys(actualOpenApi.openapi.paths).length).toBeGreaterThan(0);

    Object.values(actualOpenApi.openapi.paths).forEach((path) => {
      Object.values(path).forEach((method) => {
        expect(method).toHaveProperty("summary");
        expect(method).toHaveProperty("description");
        expect(method).toHaveProperty("responses");
        Object.values(method.responses).forEach(checkResponseSchema);
        method.parameters?.forEach(checkParameterSchema);
      });
    });

    expect(
      Object.keys(actualOpenApi.openapi.components.schemas).length
    ).toBeGreaterThan(0);
  });

  test("should convert nested API and nested types (Nested resource and nested types)", () => {
    const actualOpenApi = toOpenApi({
      api: nestedResourceApiData,
      types: nestedTypeData,
      functions: functionsData,
      declarations: declarationsData,
    });

    expect(Object.keys(actualOpenApi.openapi.paths).length).toBeGreaterThan(0);

    Object.values(actualOpenApi.openapi.paths).forEach((path) => {
      Object.values(path).forEach((method) => {
        expect(method).toHaveProperty("summary");
        expect(method).toHaveProperty("description");
        expect(method).toHaveProperty("responses");
        Object.values(method.responses).forEach(checkResponseSchema);
        method.parameters?.forEach(checkParameterSchema);
      });
    });

    expect(
      Object.keys(actualOpenApi.openapi.components.schemas).length
    ).toBeGreaterThan(0);
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
