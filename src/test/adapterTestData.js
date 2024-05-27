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
        name: "Hello",
        type: "object",
        properties: [
          {
            name: "message",
            type: "string",
          },
        ],
      },
    },
    summary: "Hello World",
    description: "Hello World",
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
            type: "Item",
          },
        ],
      },
    },
    summary: "List items by name",
    description: "List items by name",
    action:
      "function action(req) {\n    const name = req.query.name;\n    return Item.filter(item => item.name === name);\n}\n",
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
        type: "Item",
      },
    },
    summary: "Create new item",
    description: "Create new item",
    action:
      'function action(req) {\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    const check = Item.find(i => i.barcode === barcode);\n    if (check) {\n        throw "DUPLICATE_BARCODE";\n    }\n    return new Item(name, barcode);\n}\n',
  },
  {
    path: "/items/{itemId}",
    method: "GET",
    params: [
      {
        name: "itemId",
        in: "path",
        type: "string",
        required: true,
        description: "itemId",
      },
    ],
    response: {
      type: "OPENAPI",
      schema: {
        type: "Item",
      },
    },
    summary: "Get item by id",
    description: "Get item by id",
    action:
      "function action(req) {\n    const itemId = req.params.itemId;\n    return Item[itemId];\n}\n",
  },
  {
    path: "/items/{itemId}",
    method: "PUT",
    params: [
      {
        name: "itemId",
        in: "path",
        type: "string",
        required: true,
        description: "itemId",
      },
    ],
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
        type: "Item",
      },
    },
    summary: "Update item by id",
    description: "Update item by id",
    action:
      'function action(req) {\n    const item = Item[req.params.item];\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    if (!item) {\n        return;\n    }\n    const check = Item.find(i => i.barcode === barcode && i.barcode !== item.barcode);\n    if (check) {\n        throw "DUPLICATE_BARCODE";\n    }\n    item.name = name;\n    item.barcode = barcode;\n    return item;\n}\n',
  },
  {
    path: "/items/{itemId}",
    method: "DEL",
    request: {
      type: "OPENAPI",
      schema: {
        type: "object",
        properties: [
          {
            name: "id",
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
            name: "id",
            type: "string",
          },
        ],
      },
    },
    params: [
      {
        name: "itemId",
        in: "path",
        type: "string",
        required: true,
        description: "itemId",
      },
    ],
    summary: "Delete item by id",
    description: "Delete item by id",
    action:
      "function action(req) {\n    const item = req.params.item;\n    delete Item[item];\n}\n",
  },
  {
    path: "/orders",
    method: "GET",
    params: [],
    response: {
      type: "OPENAPI",
      schema: {
        type: "array",
        properties: [
          {
            type: "Order",
          },
        ],
      },
    },
    summary: "List orders",
    description: "List orders",
    action: "function action(req) {\n    return Order;\n}\n",
  },
  {
    path: "/orders",
    method: "POST",
    params: [],
    request: {
      type: "OPENAPI",
      schema: {
        type: "object",
        properties: [
          {
            name: "item",
            type: "string",
          },
          {
            name: "qty",
            type: "integer",
          },
        ],
      },
    },
    response: {
      type: "OPENAPI",
      schema: {
        type: "Order",
      },
    },
    summary: "Create order",
    description: "Create order",
    action:
      'function action(req) {\n    const item = Item[req.body.item];\n    const qty = req.body.qty;\n    if (!item) {\n        throw "INVALID_ITEM";\n    }\n    return new Order(item, qty);\n}\n',
  },
  {
    path: "/orders/{orderId}",
    method: "GET",
    params: [
      {
        name: "orderId",
        in: "path",
        type: "string",
        required: true,
        description: "orderId",
      },
    ],
    response: {
      type: "OPENAPI",
      schema: {
        type: "Order",
      },
    },
    summary: "Get order by id",
    description: "Get order by id",
    action:
      "function action(req) {\n    const order = req.params.order;\n    return Order[order];\n}\n",
  },
  {
    path: "/orders/{orderId}",
    method: "PUT",
    params: [
      {
        name: "orderId",
        in: "path",
        type: "string",
        required: true,
        description: "orderId",
      },
    ],
    request: {
      type: "OPENAPI",
      schema: {
        type: "object",
        properties: [
          {
            name: "item",
            type: "string",
          },
          {
            name: "qty",
            type: "integer",
          },
        ],
      },
    },
    response: {
      type: "OPENAPI",
      schema: {
        type: "Order",
      },
    },
    summary: "Update order by id",
    description: "Update order by id",
    action:
      'function action(req) {\n    const order = Order[req.params.order];\n    const item = Item[req.body.item];\n    const qty = req.body.qty;\n    if (!order) {\n        return;\n    }\n    if (!item) {\n        throw "INVALID_ITEM";\n    }\n    order.item = item;\n    order.qty = qty;\n    return order;\n}\n',
  },
  {
    path: "/orders/{orderId}",
    method: "DEL",
    params: [
      {
        name: "orderId",
        in: "path",
        type: "string",
        required: true,
        description: "orderId",
      },
    ],
    request: {
      type: "OPENAPI",
      schema: {
        type: "object",
        properties: [
          {
            name: "id",
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
            name: "id",
            type: "string",
          },
        ],
      },
    },
    summary: "Delete order by id",
    description: "Delete order by id",
    action:
      "function action(req) {\n    const order = req.params.order;\n    delete Order[order];\n}\n",
  },
];

const typesData = [
  {
    name: "Order",
    type: "TS",
    schema: {
      name: "Order",
      type: "object",
      properties: [
        {
          name: "item",
          type: "ref",
          ref: "Item",
        },
        {
          name: "qty",
          type: "number",
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
];
const functionsData = [
  {
    path: "/Order",
    params: ["name: string", "barcode: string"],
    type: "CLASS",
    definition:
      "class Order {\n    constructor(item, qty) {\n        this.item = item;\n        this.qty = qty;\n    }\n}\n",
  },
  {
    path: "/Item",
    params: ["name: string", "barcode: string"],
    type: "CLASS",
    definition:
      "class Item {\n    constructor(name, barcode) {\n        this.name = name;\n        this.barcode = barcode;\n    }\n}\n",
  },
];
const declarationsData = [];

const openApiData = {
  openapi: {
    paths: {
      "/": {
        get: {
          summary: "Hello World",
          description: "Hello World",
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
                      message: {
                        type: "string",
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
          summary: "List items by name",
          description: "List items by name",
          "x-nuc-action":
            "function action(req) {\n    const name = req.query.name;\n    return Item.filter(item => item.name === name);\n}\n",
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
            'function action(req) {\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    const check = Item.find(i => i.barcode === barcode);\n    if (check) {\n        throw "DUPLICATE_BARCODE";\n    }\n    return new Item(name, barcode);\n}\n',
          responses: {
            200: {
              description: "Successful Operation",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Item",
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
      "/items/{itemId}": {
        get: {
          summary: "Get item by id",
          description: "Get item by id",
          "x-nuc-action":
            "function action(req) {\n    const itemId = req.params.itemId;\n    return Item[itemId];\n}\n",
          responses: {
            200: {
              description: "Successful Operation",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Item",
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
              name: "itemId",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "itemId",
            },
          ],
        },
        put: {
          summary: "Update item by id",
          description: "Update item by id",
          "x-nuc-action":
            'function action(req) {\n    const item = Item[req.params.item];\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    if (!item) {\n        return;\n    }\n    const check = Item.find(i => i.barcode === barcode && i.barcode !== item.barcode);\n    if (check) {\n        throw "DUPLICATE_BARCODE";\n    }\n    item.name = name;\n    item.barcode = barcode;\n    return item;\n}\n',
          responses: {
            200: {
              description: "Successful Operation",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Item",
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
          parameters: [
            {
              name: "itemId",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "itemId",
            },
          ],
        },
        del: {
          summary: "Delete item by id",
          description: "Delete item by id",
          "x-nuc-action":
            "function action(req) {\n    const item = req.params.item;\n    delete Item[item];\n}\n",
          responses: {
            200: {
              description: "Successful Operation",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
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
                    id: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          parameters: [
            {
              name: "itemId",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "itemId",
            },
          ],
        },
      },
      "/orders": {
        get: {
          summary: "List orders",
          description: "List orders",
          "x-nuc-action": "function action(req) {\n    return Order;\n}\n",
          responses: {
            200: {
              description: "Successful Operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Order",
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
          parameters: [],
        },
        post: {
          summary: "Create order",
          description: "Create order",
          "x-nuc-action":
            'function action(req) {\n    const item = Item[req.body.item];\n    const qty = req.body.qty;\n    if (!item) {\n        throw "INVALID_ITEM";\n    }\n    return new Order(item, qty);\n}\n',
          responses: {
            200: {
              description: "Successful Operation",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Order",
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
                    item: {
                      type: "string",
                    },
                    qty: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
          parameters: [],
        },
      },
      "/orders/{orderId}": {
        get: {
          summary: "Get order by id",
          description: "Get order by id",
          "x-nuc-action":
            "function action(req) {\n    const order = req.params.order;\n    return Order[order];\n}\n",
          responses: {
            200: {
              description: "Successful Operation",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Order",
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
              name: "orderId",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "orderId",
            },
          ],
        },
        put: {
          summary: "Update order by id",
          description: "Update order by id",
          "x-nuc-action":
            'function action(req) {\n    const order = Order[req.params.order];\n    const item = Item[req.body.item];\n    const qty = req.body.qty;\n    if (!order) {\n        return;\n    }\n    if (!item) {\n        throw "INVALID_ITEM";\n    }\n    order.item = item;\n    order.qty = qty;\n    return order;\n}\n',
          responses: {
            200: {
              description: "Successful Operation",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Order",
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
                    item: {
                      type: "string",
                    },
                    qty: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
          parameters: [
            {
              name: "orderId",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "orderId",
            },
          ],
        },
        del: {
          summary: "Delete order by id",
          description: "Delete order by id",
          "x-nuc-action":
            "function action(req) {\n    const order = req.params.order;\n    delete Order[order];\n}\n",
          responses: {
            200: {
              description: "Successful Operation",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
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
                    id: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          parameters: [
            {
              name: "orderId",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "orderId",
            },
          ],
        },
      },
    },
    components: {
      schemas: {
        Order: {
          type: "object",
          properties: {
            item: {
              $ref: "#/components/schemas/Item",
            },
            qty: {
              type: "number",
            },
          },
        },
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
      },
    },
    "x-nuc-action": "start",
    "x-nuc-functions": [
      {
        path: "/Order",
        params: ["name: string", "barcode: string"],
        type: "CLASS",
        definition:
          "class Order {\n    constructor(item, qty) {\n        this.item = item;\n        this.qty = qty;\n    }\n}\n",
      },
      {
        path: "/Item",
        params: ["name: string", "barcode: string"],
        type: "CLASS",
        definition:
          "class Item {\n    constructor(name, barcode) {\n        this.name = name;\n        this.barcode = barcode;\n    }\n}\n",
      },
    ],
    "x-nuc-declarations": [],
  },
};

const singleResourceApiData = [
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
        name: "Hello",
        type: "object",
        properties: [
          {
            name: "message",
            type: "string",
          },
        ],
      },
    },
    summary: "Hello World",
    description: "Hello World",
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
            type: "Item",
          },
        ],
      },
    },
    summary: "List items by name",
    description: "List items by name",
    action:
      "function action(req) {\n    const name = req.query.name;\n    return Item.filter(item => item.name === name);\n}\n",
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
        type: "Item",
      },
    },
    summary: "Create new item",
    description: "Create new item",
    action:
      'function action(req) {\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    const check = Item.find(i => i.barcode === barcode);\n    if (check) {\n        throw "DUPLICATE_BARCODE";\n    }\n    return new Item(name, barcode);\n}\n',
  },
];
const singleTypeData = [
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
];

const expectedSingleResourceSingleTypeOpenApi = {
  openapi: {
    paths: {
      "/": {
        get: {
          summary: "Hello World",
          description: "Hello World",
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
                      message: {
                        type: "string",
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
          summary: "List items by name",
          description: "List items by name",
          "x-nuc-action":
            "function action(req) {\n    const name = req.query.name;\n    return Item.filter(item => item.name === name);\n}\n",
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
            'function action(req) {\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    const check = Item.find(i => i.barcode === barcode);\n    if (check) {\n        throw "DUPLICATE_BARCODE";\n    }\n    return new Item(name, barcode);\n}\n',
          responses: {
            200: {
              description: "Successful Operation",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Item",
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
      },
    },
    "x-nuc-action": "start",
    "x-nuc-functions": [
      {
        path: "/Order",
        params: ["name: string", "barcode: string"],
        type: "CLASS",
        definition:
          "class Order {\n    constructor(item, qty) {\n        this.item = item;\n        this.qty = qty;\n    }\n}\n",
      },
      {
        path: "/Item",
        params: ["name: string", "barcode: string"],
        type: "CLASS",
        definition:
          "class Item {\n    constructor(name, barcode) {\n        this.name = name;\n        this.barcode = barcode;\n    }\n}\n",
      },
    ],
    "x-nuc-declarations": [],
  },
};

const nestedResourceApiData = [
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
        name: "Hello",
        type: "object",
        properties: [
          {
            name: "message",
            type: "string",
          },
        ],
      },
    },
    summary: "Hello World",
    description: "Hello World",
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
            type: "Item",
          },
        ],
      },
    },
    summary: "List items by name",
    description: "List items by name",
    action:
      "function action(req) {\n    const name = req.query.name;\n    return Item.filter(item => item.name === name);\n}\n",
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
        type: "Item",
      },
    },
    summary: "Create new item",
    description: "Create new item",
    action:
      'function action(req) {\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    const check = Item.find(i => i.barcode === barcode);\n    if (check) {\n        throw "DUPLICATE_BARCODE";\n    }\n    return new Item(name, barcode);\n}\n',
  },
  {
    path: "/items/{itemId}",
    method: "GET",
    params: [
      {
        name: "itemId",
        in: "path",
        type: "string",
        required: true,
        description: "itemId",
      },
    ],
    response: {
      type: "OPENAPI",
      schema: {
        type: "Item",
      },
    },
    summary: "Get item by id",
    description: "Get item by id",
    action:
      "function action(req) {\n    const itemId = req.params.itemId;\n    return Item[itemId];\n}\n",
  },
  {
    path: "/items/{itemId}",
    method: "PUT",
    params: [
      {
        name: "itemId",
        in: "path",
        type: "string",
        required: true,
        description: "itemId",
      },
    ],
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
        type: "Item",
      },
    },
    summary: "Update item by id",
    description: "Update item by id",
    action:
      'function action(req) {\n    const item = Item[req.params.item];\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    if (!item) {\n        return;\n    }\n    const check = Item.find(i => i.barcode === barcode && i.barcode !== item.barcode);\n    if (check) {\n        throw "DUPLICATE_BARCODE";\n    }\n    item.name = name;\n    item.barcode = barcode;\n    return item;\n}\n',
  },
  {
    path: "/items/{itemId}",
    method: "DEL",
    request: {
      type: "OPENAPI",
      schema: {
        type: "object",
        properties: [
          {
            name: "id",
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
            name: "id",
            type: "string",
          },
        ],
      },
    },
    params: [
      {
        name: "itemId",
        in: "path",
        type: "string",
        required: true,
        description: "itemId",
      },
    ],
    summary: "Delete item by id",
    description: "Delete item by id",
    action:
      "function action(req) {\n    const item = req.params.item;\n    delete Item[item];\n}\n",
  },
];

const expectedNestedResourceSingleTypeOpenApi = {
  "openapi": {
      "paths": {
          "/": {
              "get": {
                  "summary": "Hello World",
                  "description": "Hello World",
                  "x-nuc-action": "function action(req) {\n    return { message: 'Hello World' };\n}\n",
                  "responses": {
                      "200": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      },
                      "400": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "parameters": [
                      {
                          "name": "example",
                          "in": "query",
                          "required": false,
                          "schema": {
                              "type": "string"
                          },
                          "description": "example"
                      }
                  ]
              }
          },
          "/items": {
              "get": {
                  "summary": "List items by name",
                  "description": "List items by name",
                  "x-nuc-action": "function action(req) {\n    const name = req.query.name;\n    return Item.filter(item => item.name === name);\n}\n",
                  "responses": {
                      "200": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "array",
                                      "items": {
                                          "$ref": "#/components/schemas/Item"
                                      }
                                  }
                              }
                          }
                      },
                      "400": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "parameters": [
                      {
                          "name": "name",
                          "in": "query",
                          "required": true,
                          "schema": {
                              "type": "string"
                          }
                      }
                  ]
              },
              "post": {
                  "summary": "Create new item",
                  "description": "Create new item",
                  "x-nuc-action": "function action(req) {\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    const check = Item.find(i => i.barcode === barcode);\n    if (check) {\n        throw \"DUPLICATE_BARCODE\";\n    }\n    return new Item(name, barcode);\n}\n",
                  "responses": {
                      "200": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "$ref": "#/components/schemas/Item"
                                  }
                              }
                          }
                      },
                      "400": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "requestBody": {
                      "content": {
                          "application/json": {
                              "schema": {
                                  "type": "object",
                                  "properties": {
                                      "name": {
                                          "type": "string"
                                      },
                                      "barcode": {
                                          "type": "string"
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "parameters": []
              }
          },
          "/items/{itemId}": {
              "get": {
                  "summary": "Get item by id",
                  "description": "Get item by id",
                  "x-nuc-action": "function action(req) {\n    const itemId = req.params.itemId;\n    return Item[itemId];\n}\n",
                  "responses": {
                      "200": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "$ref": "#/components/schemas/Item"
                                  }
                              }
                          }
                      },
                      "400": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "parameters": [
                      {
                          "name": "itemId",
                          "in": "path",
                          "required": true,
                          "schema": {
                              "type": "string"
                          },
                          "description": "itemId"
                      }
                  ]
              },
              "put": {
                  "summary": "Update item by id",
                  "description": "Update item by id",
                  "x-nuc-action": "function action(req) {\n    const item = Item[req.params.item];\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    if (!item) {\n        return;\n    }\n    const check = Item.find(i => i.barcode === barcode && i.barcode !== item.barcode);\n    if (check) {\n        throw \"DUPLICATE_BARCODE\";\n    }\n    item.name = name;\n    item.barcode = barcode;\n    return item;\n}\n",
                  "responses": {
                      "200": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "$ref": "#/components/schemas/Item"
                                  }
                              }
                          }
                      },
                      "400": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "requestBody": {
                      "content": {
                          "application/json": {
                              "schema": {
                                  "type": "object",
                                  "properties": {
                                      "name": {
                                          "type": "string"
                                      },
                                      "barcode": {
                                          "type": "string"
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "parameters": [
                      {
                          "name": "itemId",
                          "in": "path",
                          "required": true,
                          "schema": {
                              "type": "string"
                          },
                          "description": "itemId"
                      }
                  ]
              },
              "del": {
                  "summary": "Delete item by id",
                  "description": "Delete item by id",
                  "x-nuc-action": "function action(req) {\n    const item = req.params.item;\n    delete Item[item];\n}\n",
                  "responses": {
                      "200": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "id": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      },
                      "400": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "requestBody": {
                      "content": {
                          "application/json": {
                              "schema": {
                                  "type": "object",
                                  "properties": {
                                      "id": {
                                          "type": "string"
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "parameters": [
                      {
                          "name": "itemId",
                          "in": "path",
                          "required": true,
                          "schema": {
                              "type": "string"
                          },
                          "description": "itemId"
                      }
                  ]
              }
          }
      },
      "components": {
          "schemas": {
              "Item": {
                  "type": "object",
                  "properties": {
                      "name": {
                          "type": "string"
                      },
                      "barcode": {
                          "type": "string"
                      }
                  }
              }
          }
      },
      "x-nuc-action": "start",
      "x-nuc-functions": [
          {
              "path": "/Order",
              "params": [
                  "name: string",
                  "barcode: string"
              ],
              "type": "CLASS",
              "definition": "class Order {\n    constructor(item, qty) {\n        this.item = item;\n        this.qty = qty;\n    }\n}\n"
          },
          {
              "path": "/Item",
              "params": [
                  "name: string",
                  "barcode: string"
              ],
              "type": "CLASS",
              "definition": "class Item {\n    constructor(name, barcode) {\n        this.name = name;\n        this.barcode = barcode;\n    }\n}\n"
          }
      ],
      "x-nuc-declarations": []
  }
}

const nestedTypeData = [
  {
    name: "Order",
    type: "TS",
    schema: {
      name: "Order",
      type: "object",
      properties: [
        {
          name: "barcode",
          type: "string",
        },
        {
          name: "qty",
          type: "number",
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
          name: "order",
          type: "ref",
          ref: "Order",
        },
        {
          name: "barcode",
          type: "string",
        },
      ],
    },
  },
];

const expectedNestedResourceNestedTypesOpenApi = {
  "openapi": {
      "paths": {
          "/": {
              "get": {
                  "summary": "Hello World",
                  "description": "Hello World",
                  "x-nuc-action": "function action(req) {\n    return { message: 'Hello World' };\n}\n",
                  "responses": {
                      "200": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      },
                      "400": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "parameters": [
                      {
                          "name": "example",
                          "in": "query",
                          "required": false,
                          "schema": {
                              "type": "string"
                          },
                          "description": "example"
                      }
                  ]
              }
          },
          "/items": {
              "get": {
                  "summary": "List items by name",
                  "description": "List items by name",
                  "x-nuc-action": "function action(req) {\n    const name = req.query.name;\n    return Item.filter(item => item.name === name);\n}\n",
                  "responses": {
                      "200": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "array",
                                      "items": {
                                          "$ref": "#/components/schemas/Item"
                                      }
                                  }
                              }
                          }
                      },
                      "400": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "parameters": [
                      {
                          "name": "name",
                          "in": "query",
                          "required": true,
                          "schema": {
                              "type": "string"
                          }
                      }
                  ]
              },
              "post": {
                  "summary": "Create new item",
                  "description": "Create new item",
                  "x-nuc-action": "function action(req) {\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    const check = Item.find(i => i.barcode === barcode);\n    if (check) {\n        throw \"DUPLICATE_BARCODE\";\n    }\n    return new Item(name, barcode);\n}\n",
                  "responses": {
                      "200": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "$ref": "#/components/schemas/Item"
                                  }
                              }
                          }
                      },
                      "400": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "requestBody": {
                      "content": {
                          "application/json": {
                              "schema": {
                                  "type": "object",
                                  "properties": {
                                      "name": {
                                          "type": "string"
                                      },
                                      "barcode": {
                                          "type": "string"
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "parameters": []
              }
          },
          "/items/{itemId}": {
              "get": {
                  "summary": "Get item by id",
                  "description": "Get item by id",
                  "x-nuc-action": "function action(req) {\n    const itemId = req.params.itemId;\n    return Item[itemId];\n}\n",
                  "responses": {
                      "200": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "$ref": "#/components/schemas/Item"
                                  }
                              }
                          }
                      },
                      "400": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "parameters": [
                      {
                          "name": "itemId",
                          "in": "path",
                          "required": true,
                          "schema": {
                              "type": "string"
                          },
                          "description": "itemId"
                      }
                  ]
              },
              "put": {
                  "summary": "Update item by id",
                  "description": "Update item by id",
                  "x-nuc-action": "function action(req) {\n    const item = Item[req.params.item];\n    const name = req.body.name;\n    const barcode = req.body.barcode;\n    if (!item) {\n        return;\n    }\n    const check = Item.find(i => i.barcode === barcode && i.barcode !== item.barcode);\n    if (check) {\n        throw \"DUPLICATE_BARCODE\";\n    }\n    item.name = name;\n    item.barcode = barcode;\n    return item;\n}\n",
                  "responses": {
                      "200": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "$ref": "#/components/schemas/Item"
                                  }
                              }
                          }
                      },
                      "400": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "requestBody": {
                      "content": {
                          "application/json": {
                              "schema": {
                                  "type": "object",
                                  "properties": {
                                      "name": {
                                          "type": "string"
                                      },
                                      "barcode": {
                                          "type": "string"
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "parameters": [
                      {
                          "name": "itemId",
                          "in": "path",
                          "required": true,
                          "schema": {
                              "type": "string"
                          },
                          "description": "itemId"
                      }
                  ]
              },
              "del": {
                  "summary": "Delete item by id",
                  "description": "Delete item by id",
                  "x-nuc-action": "function action(req) {\n    const item = req.params.item;\n    delete Item[item];\n}\n",
                  "responses": {
                      "200": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "id": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      },
                      "400": {
                          "description": "Successful Operation",
                          "content": {
                              "application/json": {
                                  "schema": {
                                      "type": "object",
                                      "properties": {
                                          "message": {
                                              "type": "string"
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "requestBody": {
                      "content": {
                          "application/json": {
                              "schema": {
                                  "type": "object",
                                  "properties": {
                                      "id": {
                                          "type": "string"
                                      }
                                  }
                              }
                          }
                      }
                  },
                  "parameters": [
                      {
                          "name": "itemId",
                          "in": "path",
                          "required": true,
                          "schema": {
                              "type": "string"
                          },
                          "description": "itemId"
                      }
                  ]
              }
          }
      },
      "components": {
          "schemas": {
              "Order": {
                  "type": "object",
                  "properties": {
                      "barcode": {
                          "type": "string"
                      },
                      "qty": {
                          "type": "number"
                      }
                  }
              },
              "Item": {
                  "type": "object",
                  "properties": {
                      "order": {
                          "$ref": "#/components/schemas/Order"
                      },
                      "barcode": {
                          "type": "string"
                      }
                  }
              }
          }
      },
      "x-nuc-action": "start",
      "x-nuc-functions": [
          {
              "path": "/Order",
              "params": [
                  "name: string",
                  "barcode: string"
              ],
              "type": "CLASS",
              "definition": "class Order {\n    constructor(item, qty) {\n        this.item = item;\n        this.qty = qty;\n    }\n}\n"
          },
          {
              "path": "/Item",
              "params": [
                  "name: string",
                  "barcode: string"
              ],
              "type": "CLASS",
              "definition": "class Item {\n    constructor(name, barcode) {\n        this.name = name;\n        this.barcode = barcode;\n    }\n}\n"
          }
      ],
      "x-nuc-declarations": []
  }
}



export {
  apiData,
  typesData,
  functionsData,
  declarationsData,
  openApiData,
  nestedTypeData,
  singleResourceApiData,
  singleTypeData,
  expectedSingleResourceSingleTypeOpenApi,
  nestedResourceApiData, 
  expectedNestedResourceSingleTypeOpenApi,
  expectedNestedResourceNestedTypesOpenApi,
};
