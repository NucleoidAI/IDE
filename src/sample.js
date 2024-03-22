export class Item {
  constructor(name, barcode) {
    this.name = name;
    this.barcode = barcode;
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
    summary: "Get all users",
    description: "Get all users",
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
    "x-nuc-action": `function action(req: { query: { name: string } }): any {
        const name = req.query.name;
        return (Item as any).filter(item => item.name === name);
      }`,
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
    "x-nuc-action": `function action(req: { body: { name: string, barcode: string } }): any {
        const name = req.body.name;
        const barcode = req.body.barcode;
        const check = (Item as any).find(i => i.barcode === barcode);
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

    "x-nuc-action": `function action(req: { params: { item: string } }): any {
        const item = req.params.item;
        return Item[item];
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
];

export const functions = [
  {
    path: "/Order",
    params: ["name: string", "barcode: string"],
    type: "CLASS",
    definition: `class Order {
      name: string;
      barcode: string;
      constructor(name: string, barcode: string) {
        this.name = name;
        this.barcode = barcode;
      }
    }`,
  },
  {
    path: "/Item",
    params: ["name: string", "barcode: string"],
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
    path: "/Human",
    params: ["name: string", "barcode: string"],
    type: "CLASS",
    definition: `class Human {
      name: string;
      barcode: string;
      constructor(name: string, barcode: string) {
        this.name = name;
        this.barcode = barcode;
      }
    }`,
  },
];

export const declarations = [
  {
    description: "All humans mortal property must be true",
    summary: "All humans are mortal",
    definition: `
      $Human.mortal = true
    
      socrates = new Human('Socrates')
    
      socrates.mortal === true
    
    `,
  },
  {
    description: "If the human is older than 18, do something",
    summary: "If The Human is Over 18 Years Old",
    definition: `
      if( $Human.age > 18 )
      {
        //do something
      }
    
    `,
  },
  {
    description: "All Orders barcode string starts with NUC",
    summary: "All orders barcode start with NUC prefix",
    definition: `
      $Order.barcode.include("NUC")
    
    `,
  },
];

export const project = {
  type: "LOCAL",
  name: "Sample",
  id: "Sample",
  description:
    "Nucleoid low-code framework lets you build your APIs with the help of AI and built-in datastore",
};
