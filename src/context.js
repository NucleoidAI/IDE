import State from "./state";
import { v4 as uuid } from "uuid";
import { createContext, useContext } from "react";

function reducer(state, action) {
  state = State.copy(state);
  const { nucleoid, pages } = state;

  switch (action.type) {
    case "OPEN_API_DIALOG": {
      pages.api.dialog.open = true;
      break;
    }

    case "SAVE_API_DIALOG": {
      const { path, method } = pages.api.selected;
      const api = nucleoid.api;
      api[path][method].request = action.payload.request;
      api[path][method].response = action.payload.response;
      api[path][method].params = action.payload.params;
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

  return state;
}

const Context = createContext();
const useContextWrapper = () => useContext(Context);
export { Context, reducer, useContextWrapper as useContext };
