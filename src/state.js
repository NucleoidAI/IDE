import { v4 as uuidv4 } from "uuid";

import { api, declarations, functions, types } from "./sample";

function init() {
  const state = {
    nucleoid: {
      api: {},
      types: {},
      functions: [],
      project: {
        type: "LOCAL",
        name: "Sample",
        id: "Sample",
        description:
          "Nucleoid low-code framework lets you build your APIs with the help of AI and built-in datastore",
      },
      declarations: {},
    },
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
        selected: {
          description: "All Orders barcode string starts with NUC",
          summary: "All orders barcode start with NUC prefix",
          definition: '{\n      $Order.barcode.include("NUC")\n    }\n    ',
        },
      },
      branches: {},
    },
    get: (prop) => resolve(state, prop),
  };

  return state;
}

function copy(state) {
  return { ...state, get: (prop) => resolve(state, prop) };
}

function withSample() {
  const state = init();
  state.nucleoid.api = api;
  state.nucleoid.types = types;
  state.nucleoid.functions = functions;
  state.nucleoid.declarations = declarations;
  state.nucleoid.project.id = uuidv4();

  return state;
}

function withPages({ context }) {
  const state = init();

  const { nucleoid, pages } = context;
  state.nucleoid = nucleoid;
  state.pages = pages;

  return state;
}

const resolve = (state, param) => {
  try {
    const parts = param.split(".");
    parts[0] = state[parts[0]];
    return parts.reduce((obj, part) => obj[part]);
  } catch (error) {
    return undefined;
  }
};

const State = { init, copy, withSample, resolve, withPages };
export default State;
