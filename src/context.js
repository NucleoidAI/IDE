import State from "./state";
import { v4 as uuid } from "uuid";
import { compile, decompile, deindex, index } from "./components/APIDialog";
import { createContext, useContext } from "react";

function reducer(state, action) {
  state = State.copy(state);
  const { nucleoid, pages } = state;

  switch (action.type) {
    case "OPEN_API_DIALOG": {
      pages.api.dialog.open = true;

      const { path, method } = pages.api.selected;
      const api = nucleoid.api;
      const map = (pages.api.dialog.map = {});

      pages.api.dialog.request = compile(map, api[path][method].request);
      pages.api.dialog.response = compile(map, api[path][method].response);
      pages.api.dialog.params = index(map, api[path][method].params || []);
      pages.api.dialog.types = Object.entries(nucleoid.types)
        .map(([key, value]) => ({
          ...value,
          name: key,
          type: value.type,
        }))
        .map((type) => compile(map, type));
      break;
    }
    case "SAVE_API_DIALOG": {
      const { path, method } = pages.api.selected;
      const api = nucleoid.api;
      const map = pages.api.dialog.map;

      api[path][method].request = decompile(map, pages.api.dialog.request);
      api[path][method].response = decompile(map, pages.api.dialog.response);
      api[path][method].params = deindex(pages.api.dialog.params);
      nucleoid.types = pages.api.dialog.types.reduce((previous, current) => {
        const object = decompile(map, current);
        const name = current[Object.keys(current)[0]].name;
        return { ...previous, [name]: object };
      }, {});
    }
    // eslint-disable-next-line no-fallthrough
    case "CLOSE_API_DIALOG":
      pages.api.dialog.open = false;
      delete pages.api.dialog.request;
      delete pages.api.dialog.response;
      delete pages.api.dialog.params;
      delete pages.api.dialog.types;
      pages.api.dialog.map = {};
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
