import { api, functions, types } from "./sample";

function init() {
  const state = {
    nucleoid: {
      api: {},
      types: {},
      functions: {},
    },
    pages: {
      started: false,
      opened: false,
      api: {
        dialog: {
          view: "BODY",
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
      query: {},
      branches: {},
    },
    settings: {
      dialog: {},
      urls: {
        nucleoid: "http://localhost:8448",
        openApi: "http://localhost:3000",
      },
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

const State = { init, copy, withSample };
export default State;
