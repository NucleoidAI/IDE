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
    "x-nuc-action": `function action(req: any): { message: string } {
        return { message: "Hello World" };
      }`,
  },
  {
    path: "/orders",
    method: "POST",
    request: {
      type: "OPENAPI",
      schema: {
        type: "object",
        properties: [
          {
            type: "object",
            name: "test",
            properties: [
              {
                type: "string",
                name: "test",
              },
              {
                type: "array",
                name: "array",
                properties: [
                  {
                    type: "object",
                    name: "test",
                    properties: [
                      {
                        type: "ref",
                        name: "ali",
                        ref: "Item",
                      },
                      {
                        type: "string",
                        name: "veli",
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
    response: {
      type: "OPENAPI",
      schema: {
        type: "object",
        properties: [
          { name: "qty", type: "number" },
          { name: "test", type: "string" },
        ],
      },
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
