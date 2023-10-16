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

export const myApi = [
  {
    path: "/",
    method: "get",
    params: [
      {
        name: "example",
        in: "query",
        type: "string",
        required: false,
        description: "example",
      },
    ],
    response: "object",
  },
  {
    path: "/items",
    method: "get",
    params: [
      {
        in: "query",
        type: "string",
        required: true,
        name: "name",
      },
    ],
    response: "Item[]",
  },
  {
    path: "/items",
    method: "post",
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
    response: "Item",
  },
  {
    path: "/items/{item}",
    method: "get",
    params: [
      {
        name: "item",
        in: "path",
        type: "string",
        required: true,
        description: "item",
      },
    ],
    response: "Item",
  },
  {
    path: "/items/{item}",
    method: "put",
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
    response: "Item",
  },
  {
    path: "/items/{item}",
    method: "del",
    params: [
      {
        name: "item",
        in: "path",
        type: "string",
        required: true,
        description: "item",
      },
    ],
    response: "object",
  },
  {
    path: "/orders",
    method: "get",
    params: [],
    response: "Order[]",
  },
  {
    path: "/orders",
    method: "post",
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
    response: "Order",
  },
  {
    path: "/orders/{order}",
    method: "get",
    params: [
      {
        name: "order",
        in: "path",
        type: "string",
        required: true,
        description: "order",
      },
    ],
    response: "Order",
  },
  {
    path: "/orders/{order}",
    method: "put",
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
    response: "Order",
  },
  {
    path: "/orders/{order}",
    method: "del",
    params: [
      {
        name: "order",
        in: "path",
        type: "string",
        required: true,
        description: "Order id",
      },
    ],
    response: "object",
  },
];
