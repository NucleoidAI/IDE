export class Item {
  constructor(name, barcode) {
    this.name = name;
    this.barcode = barcode;
  }
}

export class Order {
  constructor(item, qty) {
    this.item = item;
    this.qty = qty;
  }
}

export const api = [
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
      type: "TS",
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
    "x-nuc-action": `function action(req: any): { message: string } {
        return { message: "Hello World" };
      }`,
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
        name: "Item",
        type: "object",
        properties: [
          { name: "name", type: "string" },
          { name: "barcode", type: "string" },
        ],
      },
    },
    "x-nuc-action": `function action(req: { query: { name: string } }): any {
      const name = req.query.name;
      return Item.filter(item => item.name === name);
    }`,
  },
  {
    path: "/items",
    method: "POST",
    request: {
      type: "TS",
      schema: {
        name: "Item",
        type: "object",
        properties: [
          { name: "name", type: "string" },
          { name: "barcode", type: "string" },
        ],
      },
    },
    response: {
      type: "TS",
      schema: {
        name: "Item",
        type: "object",
        properties: [
          { name: "name", type: "string" },
          { name: "barcode", type: "string" },
        ],
      },
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
      type: "TS",
      schema: {
        name: "Item",
        type: "object",
        properties: [
          { name: "name", type: "string" },
          { name: "barcode", type: "string" },
        ],
      },
    },
    "x-nuc-action": `function action(req: { params: { item: string } }): any {
      const item = req.params.item;
      return Item[item];
    }`,
  },
  {
    path: "/items/{item}",
    method: "PUT",
    request: {
      type: "TS",
      schema: {
        name: "Item",
        type: "object",
        properties: [
          { name: "name", type: "string" },
          { name: "barcode", type: "string" },
        ],
      },
    },
    response: {
      type: "TS",
      schema: {
        name: "Item",
        type: "object",
        properties: [
          { name: "name", type: "string" },
          { name: "barcode", type: "string" },
        ],
      },
    },
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
  {
    path: "/items/{item}",
    method: "DEL",
    request: {
      type: "TS",
      schema: {
        name: "Item",
        type: "object",
        properties: [
          { name: "name", type: "string" },
          { name: "barcode", type: "string" },
        ],
      },
    },
    response: {
      type: "TS",
      schema: {
        name: "Item",
        type: "object",
        properties: [
          { name: "name", type: "string" },
          { name: "barcode", type: "string" },
        ],
      },
    },
    "x-nuc-action": `function action(req: { params: { item: string } }): void {
      const item = req.params.item;
      delete Item[item];
    }`,
  },
  {
    path: "/orders",
    method: "GET",
    params: [],
    response: {
      type: "TS",
      schema: {
        name: "Order",
        type: "array",
        properties: [{ name: "item", type: "ref", ref: "Item" }],
      },
    },
    "x-nuc-action": `function action(req: any): any {
      return Order;
    }`,
  },
  {
    path: "/orders",
    method: "POST",
    request: {
      type: "object",
      properties: {
        type: "TS",
        schema: {
          name: "Order",
          type: "object",
          properties: [
            { name: "qty", type: "number" },
            { name: "item", type: "ref", ref: "Item" },
          ],
        },
      },
    },
    response: "Order",
    "x-nuc-action": `function action(req: { body: { item: string, qty: number } }): any {
      const item = Item[req.body.item];
      const qty = req.body.qty;
      if (!item) {
        throw "INVALID_ITEM";
      }
      return new Order(item, qty);
    }`,
  },
  {
    path: "/orders/{order}",
    method: "GET",
    params: [
      {
        name: "order",
        in: "path",
        type: "string",
        required: true,
        description: "order",
      },
    ],
    response: {
      type: "TS",
      schema: {
        name: "Order",
        type: "object",
        properties: [
          { name: "qty", type: "number" },
          { name: "item", type: "ref", ref: "Item" },
        ],
      },
    },
    "x-nuc-action": `function action(req: { params: { order: string } }): any {
      const order = req.params.order;
      return Order[order];
    }`,
  },
  {
    path: "/orders/{order}",
    method: "PUT",
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
      type: "TS",
      schema: {
        name: "Order",
        type: "object",
        properties: [
          { name: "qty", type: "number" },
          { name: "item", type: "ref", ref: "Item" },
        ],
      },
    },
    response: "Order",
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
  {
    path: "/orders/{order}",
    method: "DEL",
    params: [
      {
        name: "order",
        in: "path",
        type: "string",
        required: true,
        description: "Order id",
      },
    ],
    response: {
      type: "TS",
      schema: {
        name: "Order",
        type: "object",
        properties: [
          { name: "qty", type: "number" },
          { name: "item", type: "ref", ref: "Item" },
        ],
      },
    },
    "x-nuc-action": `function action(req: { params: { order: string } }): void {
      const order = req.params.order;
      delete Order[order];
    }`,
  },
];

export const types = [
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
    type: "OPENAPI",
    schema: {
      type: "object",
      name: "Order",
      properties: [
        {
          name: "id",
          type: "string",
        },
        {
          name: "qty",
          type: "number",
        },
        {
          name: "item",
          type: "ref",
          ref: "Item",
        },
      ],
    },
  },
  {
    name: "Adresses",
    type: "OPENAPI",
    schema: {
      name: "Adresses",
      type: "array",
      properties: [
        {
          name: "Adress",
          type: "object",
          properties: [
            { name: "title", type: "string" },
            { name: "code", type: "number" },
            { name: "adress", type: "string" },
            {
              name: "UserList",
              type: "array",
              properties: [
                {
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
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: "User",
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
  {
    name: "Users",
    type: "OPENAPI",
    schema: {
      name: "Users",
      type: "array",
      properties: [{ name: "user", type: "ref", ref: "User" }],
    },
  },
];

export const functions = [
  {
    path: "/Order",
    params: [],
    type: "CLASS",
    definition: `class Order1 {
      item: Item1;
      qty: number;
      date: number;
      constructor(item: Item1, qty: number) {
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
    definition: `class Item1 {
      name: string;
      barcode: string;
      adress: Adress1;
      constructor(name: string, barcode: string,adress: Adress1) {
        this.name = name;
        this.barcode = barcode;
        this.adress = adress;
      }
    }`,
  },
  {
    path: "/Adress",
    params: [],
    type: "CLASS",
    definition: `class Adress1 {
      name: string;
      constructor(name: string) {
        this.name = name;
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
