import { v4 as uuid } from "uuid";

import { api, declarations, functions, project, types } from "./sample";

function init() {
  const state = {
    nucleoid: {
      api: [],
      types: [],
      functions: [],
      project: {},
      declarations: [],
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
        selected: {},
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

function withBlank() {
  const state = init();
  state.nucleoid.project = project;
  state.nucleoid.project.id = uuid();

  return state;
}

function withSample() {
  const state = init();
  state.nucleoid.api = api;
  state.nucleoid.types = types;
  state.nucleoid.functions = functions;
  state.nucleoid.declarations = declarations;
  state.nucleoid.project = project;

  state.nucleoid.project.id = uuid();
  return state;
}

function withPages({ context }) {
  const state = init();
  state.nucleoid = context;

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

const State = { init, copy, withSample, resolve, withPages, withBlank };
export default State;
