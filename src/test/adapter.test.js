import { toOpenApi } from "../adapters/openapi/adapter";

import {
  apiData,
  openApiData as expectedOpenApi,
  typesData,
} from "./adapterTestData";

describe("toOpenApi", () => {
  test("should convert API definition and types to OpenAPI specification", () => {
    const actualOpenApi = toOpenApi({ api: apiData, types: typesData });
    expect(actualOpenApi).toEqual(expectedOpenApi);
  });
});
