import { api, declarations, functions, types } from "./sample";

function init() {
  const state = {
    nucleoid: {
      api: {},
      types: {},
      functions: [],
      project: {},
      declarations: {},
    },
    pages: {
      started: false,
      opened: false,
      api: {
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
        results: "",
        text: 'Item.filter((item) => item.name === "item-1");',
        outputRatio: 0.5,
      },
      logic: {
        dialog: {
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

  return state;
}

function withPages({ api, types, functions, logic }) {
  const state = init();
  state.nucleoid = { api, types, functions, logic };
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
