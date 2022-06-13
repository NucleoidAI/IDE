const api = {
  "/": {
    get: {
      summary: "Hello",
      description: "Hello",
      params: [],
      request: { type: "object", properties: {} },
      response: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
        },
      },
      action: `function action(req){\n\treturn "Hello World";\n}`,
    },
  },
  "/items": {
    get: {
      summary: "Read items",
      description: "Read item list",
      params: [],
      request: { type: "object", properties: {} },
      response: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Item",
        },
      },
      action: `function action(req) {\n\treturn Item;\n}\n`,
    },
    post: {
      summary: "Add item",
      description: "Add item",
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
      action: `function action(req){\n\tconst name=req.body.name;\n\tconst barcode=req.body.barcode;\n\n\treturn new Item(name,barcode);\n}\n`,
    },
  },
  "/items/{item}": {
    get: {
      summary: "Read item",
      description: "Read item by item id",
      params: [
        {
          name: "id",
          in: "param",
          type: "string",
          required: true,
          description: "Item id",
        },
      ],
      request: { type: "object", properties: {} },
      response: { $ref: "#/components/schemas/Item" },
      action: `function action(req) {\n\treturn Item[req.params.item];\n}\n`,
    },
    post: {
      summary: "Update item",
      description: "Update item",
      params: [
        {
          name: "id",
          in: "param",
          type: "string",
          required: true,
          description: "Item id",
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
      action: `function action(req) {\n\tconst name = req.body.name;\n\tconst barcode = req.body.barcode;\n\tconst item = Item[req.params.item];\n\titem.name = name;\n\titem.barcode = barcode;\n\n\treturn item;\n}\n`,
    },
    del: {
      summary: "Delete item",
      description: "Delete item",
      params: [
        {
          name: "id",
          in: "param",
          type: "string",
          required: true,
          description: "Item id",
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
      action: `function action(req) {\n\tdelete Item[req.params.item];\n}\n`,
    },
  },
  "/orders": {
    get: {
      summary: "Read orders",
      description: "Read order list",
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
      action: `function action(req) {\n\treturn Order;\n}\n`,
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
      action: `function action(req) {\n\tconst item = Item[req.body.item];\n\tconst qty = req.body.qty;\n\n\treturn new Order(item, qty);\n}\n`,
    },
  },
  "/orders/{order}": {
    get: {
      summary: "Read order",
      description: "Read order",
      params: [
        {
          name: "id",
          in: "param",
          type: "string",
          required: true,
          description: "Order id",
        },
      ],
      request: { type: "object", properties: {} },
      response: { $ref: "#/components/schemas/Order" },
      action: `function action(req) {\n\treturn Order[req.params.order];\n}\n`,
    },
    post: {
      summary: "Update order",
      description: "Update order",
      params: [
        {
          name: "id",
          in: "param",
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
      action: `function action(req) {\n\tconst item = Item[req.body.item];\n\tconst qty = req.body.qty;\n\tconst order = Order[req.params.order];\n\torder.item = item;\n\torder.qty = qty;\n\n\treturn order;\n}\n`,
    },
    del: {
      summary: "Delete order",
      description: "Delete order",
      params: [
        {
          name: "id",
          in: "param",
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
      action: `function action(req) {\n\tdelete Order[req.params.order];\n}\n`,
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
    definition: `class Order {\n\tconstructor(qty,item){\n\t\tthis.item = item;\n\t\tthis.qty = qty;\n\t\tthis.date = Date.now();\n\t}\n}`,
  },
  {
    path: "/classes/Item",
    params: [],
    type: "CLASS",
    definition: `class Item {\n\tconstructor(name, barcode) {\n\t\tthis.name = name;\n\t\tthis.barcode = barcode;\n\t}\n}`,
  },
];

export { api, types, functions };
