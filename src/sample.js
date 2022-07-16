const api = {
  "/": {
    get: {
      summary: "Hello World",
      description: "Hello World",
      params: [
        {
          name: "example",
          in: "query",
          type: "string",
          required: false,
          description: "example",
        },
      ],
      request: { type: "object", properties: {} },
      response: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
        },
      },
      action: `function action(req) {
  return { message: "Hello World" };
}
`,
    },
  },
  "/items": {
    get: {
      summary: "Get item list",
      description: "Get item list",
      params: [],
      request: { type: "object", properties: {} },
      response: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Item",
        },
      },
      action: `function action(req) {
  return Item;
}
`,
    },
    post: {
      summary: "Create item",
      description: "Create item",
      request: {
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
      response: {
        $ref: "#/components/schemas/Item",
      },
      action: `function action(req) {
  const name = req.body.name;
  const barcode = req.body.barcode;

  return new Item(name, barcode);
}
`,
    },
  },
  "/items/{item}": {
    get: {
      summary: "Get item by id",
      description: "Get item by id",
      params: [
        {
          name: "item",
          in: "path",
          type: "string",
          required: true,
          description: "item",
        },
      ],
      request: { type: "object", properties: {} },
      response: { $ref: "#/components/schemas/Item" },
      action: `function action(req) {
  const item = req.params.item;
  return Item[item];
}
`,
    },
    post: {
      summary: "Update item",
      description: "Update item",
      params: [
        {
          name: "item",
          in: "path",
          type: "string",
          required: true,
          description: "item",
        },
      ],
      request: {
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
      response: { $ref: "#/components/schemas/Item" },
      action: `function action(req) {
  const name = req.body.name;
  const barcode = req.body.barcode;
  
  const item = Item[req.params.item];
  item.name = name;
  item.barcode = barcode;

  return item;
}
`,
    },
    del: {
      summary: "Delete item",
      description: "Delete item",
      params: [
        {
          name: "item",
          in: "path",
          type: "string",
          required: true,
          description: "item",
        },
      ],
      request: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
        },
      },
      response: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
        },
      },
      action: `function action(req) {
  const item = req.params.item;
  delete Item[item];
}
`,
    },
  },
  "/orders": {
    get: {
      summary: "Get order list",
      description: "Get order list",
      params: [],
      request: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
        },
      },
      response: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Order",
        },
      },
      action: `function action(req) {
  return Order;
}
`,
    },
    post: {
      summary: "Create order",
      description: "Create order",
      params: [],
      request: {
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
      response: {
        $ref: "#/components/schemas/Order",
      },
      action: `function action(req) {
  const item = Item[req.body.item];
  const qty = req.body.qty;

  if (!item) {
    throw "INVALID_ITEM";
  }

  return new Order(item, qty);
}
`,
    },
  },
  "/orders/{order}": {
    get: {
      summary: "Get order by id",
      description: "Get order by id",
      params: [
        {
          name: "order",
          in: "path",
          type: "string",
          required: true,
          description: "order",
        },
      ],
      request: { type: "object", properties: {} },
      response: { $ref: "#/components/schemas/Order" },
      action: `function action(req) {
  const order = req.params.order;
  return Order[order];
}
`,
    },
    post: {
      summary: "Update order",
      description: "Update order",
      params: [
        {
          name: "order",
          in: "path",
          type: "string",
          required: true,
          description: "Order id",
        },
      ],
      request: {
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
      response: { $ref: "#/components/schemas/Order" },
      action: `function action(req) {
  const item = Item[req.body.item];
  const qty = req.body.qty;

  if (!item) {
    throw "INVALID_ITEM";
  }

  const order = Order[req.params.order];
  order.item = item;
  order.qty = qty;

  return order;
}
`,
    },
    del: {
      summary: "Delete order",
      description: "Delete order",
      params: [
        {
          name: "order",
          in: "path",
          type: "string",
          required: true,
          description: "Order id",
        },
      ],
      request: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
        },
      },
      response: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
        },
      },
      action: `function action(req) {
  const order = req.params.order;
  delete Order[order];
}
`,
    },
  },
};

const types = {
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
        type: "integer",
      },
    },
  },
};

const functions = [
  {
    path: "/classes/Order",
    params: [],
    type: "CLASS",
    definition: `class Order {
  constructor(item, qty) {
    this.item = item;
    this.qty = qty;
    this.date = Date.now();
  }
}
`,
  },
  {
    path: "/classes/Item",
    params: [],
    type: "CLASS",
    definition: `class Item {
  constructor(name, barcode) {
    this.name = name;
    this.barcode = barcode;
  }
}
`,
  },
];

export { api, types, functions };
