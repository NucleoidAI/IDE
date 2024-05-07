// TODO Use specification instead
const apiData = [
  {
    path: "/",
    method: "GET",
    params: [
      {
        name: "example",
        in: "query",
        type: "string",
        required: false,
        description: "example",
      },
    ],
    response: {
      type: "OPENAPI",
      schema: {
        name: "User",
        type: "object",
        properties: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "age",
            type: "number",
          },
        ],
      },
    },
    summary: "Get all users",
    description: "Get all users",
    action:
      "function action(req) {\n    return { message: 'Hello World' };\n}\n",
  },
  {
    path: "/items",
    method: "GET",
    params: [
      {
        in: "query",
        type: "string",
        required: true,
        name: "name",
      },
    ],
    response: {
      type: "OPENAPI",
      schema: {
        type: "array",
        properties: [
          {
            type: "ref",
            name: "item",
            ref: "Item",
          },
        ],
      },
    },
    summary: "Get item by name",
    description: "Get item by name",
    action:
      "function action(req) {\n    const name = req.query.name;\n    return Item.filter((item) => item.name === name);\n}\n",
  },
  {
    path: "/items",
    method: "POST",
    request: {
      type: "OPENAPI",
      schema: {
        type: "object",
        properties: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "barcode",
            type: "string",
          },
        ],
      },
    },
    response: {
      type: "OPENAPI",
      schema: {
        type: "object",
        properties: [
          {
            type: "ref",
            name: "item",
            ref: "Item",
          },
        ],
      },
    },
    summary: "Create new item",
    description: "Create new item",
    action:
      "function action(req) {\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    const check = Item.find((i) => i.barcode === barcode);\n    if (check) {\n        throw 'DUPLICATE_BARCODE';\n    }\n    return new Item(name, barcode);\n}\n",
  },
  {
    path: "/items/{item}",
    method: "GET",
    params: [
      {
        name: "item",
        in: "path",
        type: "string",
        required: true,
        description: "item",
      },
    ],
    response: {
      type: "OPENAPI",
      schema: {
        type: "object",
        properties: [
          {
            type: "ref",
            name: "item",
            ref: "Item",
          },
        ],
      },
    },
    summary: "Get item by id",
    description: "Get item by id",
    action:
      "function action(req) {\n    const item = req.params.item;\n    return Item[item];\n}\n",
  },
];

const typesData = [
  {
    name: "Item",
    type: "OPENAPI",
    schema: {
      name: "Item",
      type: "object",
      properties: [
        {
          type: "string",
          name: "id",
        },
        {
          type: "string",
          name: "name",
        },
        {
          type: "string",
          name: "barcode",
        },
      ],
    },
  },
  {
    name: "Order",
    type: "TS",
    schema: {
      name: "Order",
      type: "object",
      properties: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "barcode",
          type: "string",
        },
      ],
    },
  },
  {
    name: "Item",
    type: "TS",
    schema: {
      name: "Item",
      type: "object",
      properties: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "barcode",
          type: "string",
        },
      ],
    },
  },
  {
    name: "Human",
    type: "TS",
    schema: {
      name: "Human",
      type: "object",
      properties: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "barcode",
          type: "string",
        },
      ],
    },
  },
];

const openApiData = {
  paths: {
    "/": {
      get: {
        summary: "Get all users",
        description: "Get all users",
        "x-nuc-action":
          "function action(req) {\n    return { message: 'Hello World' };\n}\n",
        responses: {
          200: {
            description: "Successful Operation",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    age: {
                      type: "number",
                    },
                  },
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
        parameters: [
          {
            name: "example",
            in: "query",
            required: false,
            schema: {
              type: "string",
            },
            description: "example",
          },
        ],
      },
    },
    "/items": {
      get: {
        summary: "Get item by name",
        description: "Get item by name",
        "x-nuc-action":
          "function action(req) {\n    const name = req.query.name;\n    return Item.filter((item) => item.name === name);\n}\n",
        responses: {
          200: {
            description: "Successful Operation",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Item",
                  },
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
        parameters: [
          {
            name: "name",
            in: "query",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
      },
      post: {
        summary: "Create new item",
        description: "Create new item",
        "x-nuc-action":
          "function action(req) {\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    const check = Item.find((i) => i.barcode === barcode);\n    if (check) {\n        throw 'DUPLICATE_BARCODE';\n    }\n    return new Item(name, barcode);\n}\n",
        responses: {
          200: {
            description: "Successful Operation",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    item: {
                      $ref: "#/components/schemas/Item",
                    },
                  },
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
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  barcode: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        parameters: [],
      },
    },
    "/items/{item}": {
      get: {
        summary: "Get item by id",
        description: "Get item by id",
        "x-nuc-action":
          "function action(req) {\n    const item = req.params.item;\n    return Item[item];\n}\n",
        responses: {
          200: {
            description: "Successful Operation",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    item: {
                      $ref: "#/components/schemas/Item",
                    },
                  },
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
        parameters: [
          {
            name: "item",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "item",
          },
        ],
      },
    },
  },
  components: {
    schemas: {
      Item: {
        type: "object",
        properties: {
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
          name: {
            type: "string",
          },
          barcode: {
            type: "string",
          },
        },
      },
      Human: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          barcode: {
            type: "string",
          },
        },
      },
    },
  },
};

export { apiData, typesData, openApiData };
