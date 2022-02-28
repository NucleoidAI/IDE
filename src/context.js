import State from "./state";
import { v4 as uuid } from "uuid";
import { createContext, useContext } from "react";

function reducer(state, { type, payload }) {
  state = State.copy(state);
  const { nucleoid, pages } = state;

  switch (type) {
    case "OPEN_API_DIALOG": {
      pages.api.dialog.type = payload.type;
      pages.api.dialog.open = true;
      break;
    }

    case "SAVE_API_DIALOG": {
      const { request, response, params, types } = payload;

      let method = pages.api.selected.method;
      const path = pages.api.selected.path;
      const api = nucleoid.api;

      if (pages.api.dialog.type === "method") {
        api[path][payload.method] = {};
        pages.api.selected.method = payload.method;
        api[path][payload.method].request = payload.request;
        api[path][payload.method].response = payload.response;
        api[path][payload.method].params = payload.params;
        nucleoid.types = payload.types;
        break;
      }

      if (pages.api.dialog.type === "resource") {
        //TODO BUG : when a resource is added it changes in other resources
        const path = payload.path;
        const method = payload.method;

        api[path] = { [method]: {} };
        pages.api.selected.method = payload.method;
        api[path][method].request = payload.request;
        api[path][method].response = payload.response;
        api[path][method].params = payload.params;
        nucleoid.types = payload.types;

        break;
      }

      if (method !== payload.method) {
        api[path][payload.method] = { ...api[path][method] };
        delete api[path][method];

        method = payload.method;
        pages.api.selected.method = method;
      }

      api[path][method].request = request;
      api[path][method].response = response;
      api[path][method].params = params;
      nucleoid.types = types;
    }

    // eslint-disable-next-line no-fallthrough
    case "CLOSE_API_DIALOG":
      pages.api.dialog.open = false;
      break;

    case "SET_API_DIALOG_VIEW":
      pages.api.dialog.view = payload.view;
      break;

    case "SET_SELECTED_API":
      if (payload.method === null) {
        const method = Object.keys(nucleoid.api[payload.path])[0];
        payload.method = method;
      }
      pages.api.selected = {
        path: payload.path,
        method: payload.method,
      };
      break;

    case "SET_SELECTED_FUNCTION":
      pages.functions.selected = payload.function;
      break;

    case "OPEN_RESOURCE_MENU":
      pages.api.resourceMenu.open = true;
      pages.api.resourceMenu.anchor = payload.anchor;
      pages.api.resourceMenu.path = payload.path;
      break;

    case "CLOSE_RESOURCE_MENU":
      pages.api.resourceMenu.open = false;
      pages.api.resourceMenu = {};
      break;

    case "OPEN_FUNCTION_DIALOG": {
      pages.functions.dialog.open = true;
      break;
    }

    case "SAVE_FUNCTION_DIALOG": {
      const { path, type, code, params } = payload;
      const functions = nucleoid.functions;

      functions[path] = { type, params, code };
    }

    // eslint-disable-next-line no-fallthrough
    case "CLOSE_FUNCTION_DIALOG":
      pages.functions.dialog.open = false;
      break;

    case "UPDATE_TYPE": {
      const { id, name, type } = payload;
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
      const { id } = payload;
      const map = pages.api.dialog.map;
      const key = uuid();
      map[key] = map[id].properties[key] = {
        id: key,
        type: "integer",
      };
      break;
    }

    case "REMOVE_SCHEMA_PROPERTY": {
      const { id } = payload;
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
      const { id } = payload;
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
