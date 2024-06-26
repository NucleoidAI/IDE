import { v4 as uuid } from "uuid";

import { api, declarations, functions, project, types } from "./sample";

function init() {
  const context = {
    specification: {
      api: [],
      types: [],
      functions: [],
      declarations: [],
    },
    project: {},
    pages: {
      started: false,
      opened: false,
      api: {
        AIDialog: { open: false },
        dialog: {
          view: "BODY",
          type: "",
          action: "",
        },
        resourceMenu: {
          open: false,
          anchor: {},
        },
      },
      functions: {
        dialog: {
          open: false,
        },
      },
      query: {
        AIDialog: {
          open: false,
        },
        results: "",
        text: 'Item.filter((item) => item.name === "item-1");',
        outputRatio: 0.5,
      },
      logic: {
        AIDialog: {
          open: false,
        },
        selected: {},
      },
      branches: {},
    },
    get: (prop) => resolve(context, prop),
  };

  return context;
}

function copy(context) {
  return { ...context, get: (prop) => resolve(context, prop) };
}

function withBlank() {
  const context = init();
  context.project = project;
  context.project.id = uuid();

  return context;
}

function withSample() {
  const context = init();
  context.specification.api = api;
  context.specification.types = types;
  context.specification.functions = functions;
  context.specification.declarations = declarations;
  context.project = project;

  context.project.id = uuid();
  return context;
}

function withPages({ specification, project }) {
  const context = init();
  context.specification = specification;
  context.project = project;

  return context;
}

const resolve = (context, param) => {
  try {
    const parts = param.split(".");
    parts[0] = context[parts[0]];
    return parts.reduce((obj, part) => obj[part]);
  } catch (error) {
    return undefined;
  }
};

const Context = {
  init,
  copy,
  withSample,
  resolve,
  withPages,
  withBlank,
};
export default Context;
