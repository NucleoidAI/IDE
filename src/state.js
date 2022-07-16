import { api, functions, types } from "./sample";

function init() {
  const state = {
    nucleoid: {
      api: {},
      types: {},
      functions: [],
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

const State = { init, copy, withSample, resolve };
export default State;
