import State from "./state";
import { v4 as uuid } from "uuid";
import { createContext, useContext } from "react";

let globalState;

function reducer(state, action) {
  state = State.copy(state);
  const { nucleoid, pages, settings } = state;

  switch (action.type) {
    case "OPEN_API_DIALOG": {
      pages.api.dialog.open = true;
      break;
    }

    case "SAVE_API_DIALOG": {
      let method = pages.api.selected.method;
      const path = pages.api.selected.path;
      const api = nucleoid.api;

      if (method !== action.payload.method) {
        api[path][action.payload.method] = { ...api[path][method] };
        delete api[path][method];

        method = action.payload.method;
        pages.api.selected.method = method;
      }

      api[path][method].request = action.payload.request;
      api[path][method].response = action.payload.response;
      api[path][method].params = action.payload.params;
      nucleoid.types = action.payload.types;
    }
    // eslint-disable-next-line no-fallthrough

    case "CLOSE_API_DIALOG":
      pages.api.dialog.open = false;
      break;
    case "SET_API_DIALOG_VIEW":
      pages.api.dialog.view = action.payload.view;
      break;
    case "SET_SELECTED_API":
      pages.api.selected = {
        path: action.payload.path,
        method: action.payload.method,
      };
      break;
    case "SET_SELECTED_FUNCTION":
      pages.functions.selected = action.payload.function;
      break;
    case "OPEN_FUNCTION_DIALOG": {
      pages.functions.dialog.open = true;
      break;
    }

    case "SAVE_FUNCTION_DIALOG": {
      const path = action.payload.path;
      const functions = nucleoid.functions;

      functions[path] = {};
      functions[path].type = action.payload.type;
      functions[path].code = action.payload.code;
      functions[path].params = action.payload.params;
    }
    // eslint-disable-next-line no-fallthrough
    case "CLOSE_FUNCTION_DIALOG":
      pages.functions.dialog.open = false;
      break;

    case "SAVE_SETTING_DIALOG":
      settings.urls = action.payload.urls;

      break;

    case "UPDATE_TYPE": {
      const { id, name, type } = action.payload;
      const map = pages.api.dialog.map;

      if (name !== undefined) map[id].name = name;
      if (type !== undefined) {
        if (map[id].type === "array") map[id].items.type = type;
        else {
          map[id].type = type;

          if (type === "array") map[id].items = { type: "integer" };
          else if (type === "object") map[id].properties = {};
        }
      }

      break;
    }
    case "ADD_SCHEMA_PROPERTY": {
      const { id } = action.payload;
      const map = pages.api.dialog.map;
      const key = uuid();
      map[key] = map[id].properties[key] = {
        id: key,
        type: "integer",
      };
      break;
    }
    case "REMOVE_SCHEMA_PROPERTY": {
      const { id } = action.payload;
      const map = pages.api.dialog.map;
      delete map[id];
      break;
    }
    case "ADD_PARAM": {
      const map = pages.api.dialog.map;
      const id = uuid();
      pages.api.dialog.params[id] = map[id] = {
        id,
        type: "string",
        required: true,
      };
      break;
    }
    case "REMOVE_PARAM": {
      const { id } = action.payload;
      const map = pages.api.dialog.map;
      delete pages.api.dialog.params[id];
      delete map[id];
      break;
    }

    default:
  }
  globalState = state;
  return state;
}

const Context = createContext();
const useContextWrapper = () => useContext(Context);
export { Context, globalState, reducer, useContextWrapper as useContext };
