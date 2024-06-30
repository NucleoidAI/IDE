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
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        barcode: {
          type: "string",
        },
      },
    });
    expect(
      openapi.paths["/items"].post.responses["200"].content["application/json"]
        .schema
    ).toEqual({
      $ref: "#/components/schemas/Item",
    });
    expect(
      openapi.paths["/items/{itemId}"].get.responses["200"].content[
        "application/json"
      ].schema
    ).toEqual({
      $ref: "#/components/schemas/Item",
    });
    expect(
      openapi.paths["/items/{itemId}"].put.requestBody.content[
        "application/json"
      ].schema
    ).toEqual({
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        barcode: {
          type: "string",
        },
      },
    });
    expect(
      openapi.paths["/items/{itemId}"].put.responses["200"].content[
        "application/json"
      ].schema
    ).toEqual({
      $ref: "#/components/schemas/Item",
    });
    expect(
      openapi.paths["/items/{itemId}"].del.requestBody.content[
        "application/json"
      ].schema
    ).toEqual({
      type: "object",
      properties: {
        id: {
          type: "string",
        },
      },
    });
    expect(
      openapi.paths["/items/{itemId}"].del.responses["200"].content[
        "application/json"
      ].schema
    ).toEqual({
      type: "object",
      properties: {
        id: {
          type: "string",
        },
      },
    });
    expect(
      openapi.paths["/orders"].get.responses["200"].content["application/json"]
        .schema
    ).toEqual({
      type: "array",
      items: {
        $ref: "#/components/schemas/Order",
      },
    });
    expect(
      openapi.paths["/orders"].post.requestBody.content["application/json"]
        .schema
    ).toEqual({
      type: "object",
      properties: {
        item: {
          type: "string",
        },
        qty: {
          type: "integer",
        },
      },
    });
    expect(
      openapi.paths["/orders"].post.responses["200"].content["application/json"]
        .schema
    ).toEqual({
      $ref: "#/components/schemas/Order",
    });
    expect(
      openapi.paths["/orders/{orderId}"].get.responses["200"].content[
        "application/json"
      ].schema
    ).toEqual({
      $ref: "#/components/schemas/Order",
    });
    expect(
      openapi.paths["/orders/{orderId}"].put.requestBody.content[
        "application/json"
      ].schema
    ).toEqual({
      type: "object",
      properties: {
        item: {
          type: "string",
        },
        qty: {
          type: "integer",
        },
      },
    });
    expect(
      openapi.paths["/orders/{orderId}"].put.responses["200"].content[
        "application/json"
      ].schema
    ).toEqual({
      $ref: "#/components/schemas/Order",
    });
    expect(
      openapi.paths["/orders/{orderId}"].del.requestBody.content[
        "application/json"
      ].schema
    ).toEqual({
      type: "object",
      properties: {
        id: {
          type: "string",
        },
      },
    });
    expect(
      openapi.paths["/orders/{orderId}"].del.responses["200"].content[
        "application/json"
      ].schema
    ).toEqual({
      type: "object",
      properties: {
        id: {
          type: "string",
        },
      },
    });

    expect(openapi.components.schemas).toEqual({
      Item: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          barcode: {
            type: "string",
          },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          item: {
            $ref: "#/components/schemas/Item",
          },
          qty: {
            type: "number",
          },
        },
      },
    });
  });
});

test("converts single resource and single type", () => {
  const { openapi } = toOpenApi({
    api: singleResourceApiData,
    types: singleTypeData,
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
    openapi.paths["/items"].post.requestBody.content["application/json"].schema
  ).toEqual({
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      barcode: {
        type: "string",
      },
    },
  });
  expect(
    openapi.paths["/items"].post.responses["200"].content["application/json"]
      .schema
  ).toEqual({
    $ref: "#/components/schemas/Item",
  });

  expect(openapi.components.schemas).toEqual({
    Item: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        name: {
          type: "string",
        },
        barcode: {
          type: "string",
        },
      },
    },
  });
});

test("converts nested resource and single type", () => {
  const { openapi } = toOpenApi({
    api: nestedResourceApiData,
    types: singleTypeData,
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
    openapi.paths["/items"].post.requestBody.content["application/json"].schema
  ).toEqual({
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      barcode: {
        type: "string",
      },
    },
  });
  expect(
    openapi.paths["/items"].post.responses["200"].content["application/json"]
      .schema
  ).toEqual({
    $ref: "#/components/schemas/Item",
  });
  expect(
    openapi.paths["/items/{itemId}"].get.responses["200"].content[
      "application/json"
    ].schema
  ).toEqual({
    $ref: "#/components/schemas/Item",
  });
  expect(
    openapi.paths["/items/{itemId}"].put.requestBody.content["application/json"]
      .schema
  ).toEqual({
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      barcode: {
        type: "string",
      },
    },
  });
  expect(
    openapi.paths["/items/{itemId}"].put.responses["200"].content[
      "application/json"
    ].schema
  ).toEqual({
    $ref: "#/components/schemas/Item",
  });
  expect(
    openapi.paths["/items/{itemId}"].del.requestBody.content["application/json"]
      .schema
  ).toEqual({
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
  });
  expect(
    openapi.paths["/items/{itemId}"].del.responses["200"].content[
      "application/json"
    ].schema
  ).toEqual({
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
  });

  expect(openapi.components.schemas).toEqual({
    Item: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        name: {
          type: "string",
        },
        barcode: {
          type: "string",
        },
      },
    },
  });
});

test("converts nested resource and nested types", () => {
  const { openapi } = toOpenApi({
    api: nestedResourceApiData,
    types: nestedTypeData,
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
    openapi.paths["/items"].post.requestBody.content["application/json"].schema
  ).toEqual({
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      barcode: {
        type: "string",
      },
    },
  });
  expect(
    openapi.paths["/items"].post.responses["200"].content["application/json"]
      .schema
  ).toEqual({
    $ref: "#/components/schemas/Item",
  });
  expect(
    openapi.paths["/items/{itemId}"].get.responses["200"].content[
      "application/json"
    ].schema
  ).toEqual({
    $ref: "#/components/schemas/Item",
  });
  expect(
    openapi.paths["/items/{itemId}"].put.requestBody.content["application/json"]
      .schema
  ).toEqual({
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      barcode: {
        type: "string",
      },
    },
  });
  expect(
    openapi.paths["/items/{itemId}"].put.responses["200"].content[
      "application/json"
    ].schema
  ).toEqual({
    $ref: "#/components/schemas/Item",
  });
  expect(
    openapi.paths["/items/{itemId}"].del.requestBody.content["application/json"]
      .schema
  ).toEqual({
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
  });
  expect(
    openapi.paths["/items/{itemId}"].del.responses["200"].content[
      "application/json"
    ].schema
  ).toEqual({
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
  });

  expect(openapi.components.schemas).toEqual({
    Order: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        barcode: {
          type: "string",
        },
        qty: {
          type: "number",
        },
      },
    },
    Item: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        order: {
          $ref: "#/components/schemas/Order",
        },
        barcode: {
          type: "string",
        },
      },
    },
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
