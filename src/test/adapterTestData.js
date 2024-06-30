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
      schema: {
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
      schema: {
        type: "array",
        items: {
          type: "Item",
        },
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
      schema: {
        type: "array",
        items: {
          type: "Order",
        },
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
    schema: {
      type: "object",
      properties: [
        {
          name: "item",
          type: "Item",
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
      schema: {
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
      schema: {
        type: "array",
        items: {
          type: "Item",
        },
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
];

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
      schema: {
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
      schema: {
        type: "array",
        items: {
          type: "Item",
        },
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

const nestedTypeData = [
  {
    name: "Order",
    schema: {
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
    schema: {
      type: "object",
      properties: [
        {
          name: "order",
          type: "Order",
        },
        {
          name: "barcode",
          type: "string",
        },
      ],
    },
  },
];

export {
  apiData,
  declarationsData,
  functionsData,
  nestedResourceApiData,
  nestedTypeData,
  singleResourceApiData,
  singleTypeData,
  typesData,
};
