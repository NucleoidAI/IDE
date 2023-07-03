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
      "x-nuc-action": `function action(req: any): { message: string } {
        return { message: "Hello World" };
      }`,
    },
  },
  "/items": {
    get: {
      summary: "Get item list by name",
      description: "Get item by name",
      params: [
        {
          in: "query",
          type: "string",
          required: true,
          name: "name",
        },
      ],
      request: { type: "object", properties: {} },
      response: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Item",
        },
      },
      "x-nuc-action": `function action(req: { query: { name: string } }): any {
        const name = req.query.name;
        return Item.filter(item => item.name === name);
      }`,
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
      "x-nuc-action": `function action(req: { body: { name: string, barcode: string } }): any {
        const name = req.body.name;
        const barcode = req.body.barcode;
        const check = Item.find(i => i.barcode === barcode);
        if(check) {
          throw "DUPLICATE_BARCODE";
        }
        return new Item(name, barcode);
      }`,
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
      "x-nuc-action": `function action(req: { params: { item: string } }): any {
        const item = req.params.item;
        return Item[item];
      }`,
    },
    put: {
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
      "x-nuc-action": `function action(req: { params: { item: string }, body: { name: string, barcode: string } }): any {
        const item = Item[req.params.item];
        const name = req.body.name;
        const barcode = req.body.barcode;
        if (!item) {
          return;
        }
        const check = Item.find(
          i => i.barcode === barcode && i.barcode !== item.barcode
        );
        if (check) {
          throw "DUPLICATE_BARCODE";
        }
        item.name = name;
        item.barcode = barcode;
        return item;
      }`,
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
      "x-nuc-action": `function action(req: { params: { item: string } }): void {
        const item = req.params.item;
        delete Item[item];
      }`,
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
      "x-nuc-action": `function action(req: any): any {
        return Order;
      }`,
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
      "x-nuc-action": `function action(req: { body: { item: string, qty: number } }): any {
        const item = Item[req.body.item];
        const qty = req.body.qty;
        if (!item) {
          throw "INVALID_ITEM";
        }
        return new Order(item, qty);
      }`,
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
      "x-nuc-action": `function action(req: { params: { order: string } }): any {
        const order = req.params.order;
        return Order[order];
      }`,
    },
    put: {
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
      "x-nuc-action": `function action(req: { params: { order: string }, body: { item: string, qty: number } }): any {
        const order = Order[req.params.order];
        const item = Item[req.body.item];
        const qty = req.body.qty;
        if (!order) {
          return;
        }
        if (!item) {
          throw "INVALID_ITEM";
        }
        order.item = item;
        order.qty = qty;
        return order;
      }`,
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
      "x-nuc-action": `function action(req: { params: { order: string } }): void {
        const order = req.params.order;
        delete Order[order];
      }`,
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
    path: "/Order",
    params: [],
    type: "CLASS",
    definition: `class Order {
      item: string;
      qty: number;
      date: number;
      constructor(item: string, qty: number) {
        this.item = item;
        this.qty = qty;
        this.date = Date.now();
      }
    }`,
  },
  {
    path: "/Item",
    params: [],
    type: "CLASS",
    definition: `class Item {
      name: string;
      barcode: string;
      constructor(name: string, barcode: string) {
        this.name = name;
        this.barcode = barcode;
      }
    }`,
  },

  {
    path: "/event",
    params: [],
    type: "FUNCTION",
    builtin: true,
    definition: `function event(name: string, data: any): void {}`,
  },
  {
    path: "/uuid",
    params: [],
    type: "FUNCTION",
    builtin: true,
    definition: `function uuid(): void {}`,
  },
  {
    path: "/random",
    params: [],
    type: "FUNCTION",
    builtin: true,
    definition: `function random(length: number): void {}`,
  },
];

export { api, types, functions };
