import { toOpenApi } from "../adapters/openapi/adapter";

import {
  apiData,
  openApiData as expectedOpenApi,
  typesData,
} from "./adapterTestData";

// TODO Convert to BDD
describe("toOpenApi", () => {
  test("converts API definition and types to OpenAPI specification", () => {
    const actualOpenApi = toOpenApi({ api: apiData, types: typesData });
    expect(actualOpenApi).toEqual(expectedOpenApi);
  });
});
