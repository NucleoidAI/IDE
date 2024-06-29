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
    action: `
function action(req) {
  return { message: "Hello World" };
}
`,
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
        properties: [
          {
            type: "Item",
          },
        ],
      },
    },
    summary: "List items by name",
    description: "List items by name",
    action: `
function action(req) {
  const name = req.query.name;
  return Item.filter(item => item.name === name);
}
`,
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
    action: `
function action(req) {
  const name = req.body.name;
  const barcode = req.body.barcode;

  const check = Item.find(i => i.barcode === barcode);

  if(check) {
    throw "DUPLICATE_BARCODE";
  }

  return new Item(name, barcode);
}
`,
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
    action: `
function action(req) {
  const itemId = req.params.itemId;
  return Item[itemId];
}
`,
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
    action: `
function action(req) {
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
}
`,
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
    action: `
function action(req) {
  const item = req.params.item;
  delete Item[item];
}
`,
  },
  {
    path: "/orders",
    method: "GET",
    params: [],
    response: {
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
    action: `
function action(req) {
  return Order;
}
`,
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
    action: `
function action(req) {
  const item = Item[req.body.item];
  const qty = req.body.qty;

  if (!item) {
    throw "INVALID_ITEM";
  }

  return new Order(item, qty);
}
`,
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
    action: `
function action(req) {
  const order = req.params.order;
  return Order[order];
}
`,
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
    action: `
function action(req) {
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
}
`,
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
    action: `
function action(req) {
  const order = req.params.order;
  delete Order[order];
}
`,
  },
];

export const types = [];

export const functions = [
  {
    path: "/Order",
    params: ["name: string", "barcode: string"],
    type: "CLASS",
    definition: `class Order {
      item: Item;
      qty: number;

      constructor(item: Item, qty: number) {
        this.item = item;
        this.qty = qty;
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
];

export const declarations = [];

export const project = {
  type: "LOCAL",
  name: "Sample",
  id: "Sample",
  description:
    "Nucleoid low-code framework lets you build your APIs with the help of AI and built-in datastore",
};
