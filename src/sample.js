const api = {
  "/": {
    get: {
      summary: "Hello World",
      description: "Hello World",
      response: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      action: `return json.name;`,
      params: [
        {
          name: "order",
          in: "query",
          type: "string",
          required: true,
          description: "filter by order",
        },
        {
          name: "item",
          in: "query",
          type: "integer",
          required: false,
          description: "filter by item",
        },
      ],
    },
  },
  "/devices": {
    get: {
      summary: "List devices",
      description: "List devices",
      response: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      action: `return json.name;`,
    },
    post: {
      summary: "Update the device",
      description: "Update the device",
      request: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      response: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      action: `return json.name;`,
    },
  },
  "/questions": {
    get: {
      summary: "Retrieve the question",
      description: "Retrieve the question",
      response: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      action: `return json.name;`,
    },
    post: {
      summary: "Update the question",
      description: "Update the question",
      request: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      response: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      action: `return json.name;`,
    },
    put: {
      summary: "Create a question",
      description: "Create a question",
      request: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      response: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      action: `return json.name;`,
    },
    del: {
      summary: "Delete the question",
      description: "Delete the question",
      request: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      response: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      action: `return json.name;`,
    },
  },
  "/questions/reviews": {
    post: {
      summary: "Create a review",
      description: "Create a review",
      request: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      response: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
      },
      action: `return json.name;`,
    },
  },
};

const types = {
  Order: {
    type: "array",
    properties: {
      id: {
        type: "integer",
      },
      name: {
        type: "string",
      },
    },
  },
  Item: {
    type: "object",
    properties: {
      id: {
        type: "integer",
      },
      sku: {
        type: "string",
      },
    },
  },
};

const functions = {
  "/getInfo": {
    params: [],
    type: "FUNCTION",
    code: `function getInfo() {\n  return "Hello";\n}`,
  },
  "/users/getUser": {
    params: ["user"],
    type: "FUNCTION",
    code:
      "function getUser(user) {\n" +
      "  return Users.find(u => u.user == user);\n" +
      "}",
  },
  "/users/User": {
    type: "CLASS",
    params: ["email", "password"],
    code:
      "class User {\n" +
      "  constructor(name) {\n" +
      "    this.name = name;\n" +
      "  }\n" +
      "}",
  },
  "/utils/validate": {
    type: "FUNCTION",
    params: ["array"],
    code:
      "function validate(array) {\n" +
      "  return array.length ? true : false;\n" +
      "}",
  },
};

export { api, types, functions };
