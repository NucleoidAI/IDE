import ActionTemplate from "../templates/ActionTemplate.js";
import Context from "../context";
import { publish } from "@nucleoidai/react-event";
import service from "../service.js";
import { storage } from "@nucleoidjs/webstorage";
import { v4 as uuid } from "uuid";

function contextReducer(context, { type, payload }) {
  context = Context.copy(context);

  const { specification, pages } = context;

  switch (type) {
    case "SET_PROJECT": {
      specification.api = payload.project.specification.api;
      specification.functions = payload.project.specification.functions;
      specification.types = payload.project.specification.types;
      pages.api.selected.path = "/";

      break;
    }

    case "OPEN_API_DIALOG": {
      const { type, action } = payload;

      pages.api.dialog.type = type;
      pages.api.dialog.action = action;
      pages.api.dialog.open = true;

      break;
    }

    case "SAVE_API_DIALOG": {
      const {
        path,
        method,
        request,
        response,
        params,
        types,
        summary,
        description,
      } = payload;

      const newApi = {
        path,
        method,
        request,
        response,
        params,
        summary,
        description,
        action: ActionTemplate[method.toUpperCase()],
      };
      pages.api.dialog.open = false;
      specification.api.push(newApi);
      pages.api.selected = { path, method };
      publish("SELECTED_API_CHANGED", {
        path: path,
        method: method,
      });

      specification.types = types;
      break;
    }

    case "CLOSE_API_DIALOG": {
      pages.api.dialog.open = false;
      break;
    }

    case "SET_API_DIALOG_VIEW":
      pages.api.dialog.view = payload.view;
      break;

    case "SET_SELECTED_API": {
      if (payload.method === null) {
        const endpoint = specification.api.find(
          (endpoint) => endpoint.path === payload.path
        );

        if (endpoint && endpoint.method) {
          payload.method = endpoint.method;
        }
      }
      pages.api.selected = {
        path: payload.path,
        method: payload.method,
      };

      publish("SELECTED_API_CHANGED", {
        path: payload.path,
        method: payload.method,
      });

      break;
    }

    case "SET_SELECTED_FUNCTION": {
      pages.functions.selected = payload.function;
      break;
    }

    case "SET_SELECTED_LOGIC": {
      pages.logic.selected = payload.logic;
      break;
    }

    case "OPEN_RESOURCE_MENU":
      pages.api.resourceMenu.open = true;
      pages.api.resourceMenu.anchor = payload.anchor;
      pages.api.resourceMenu.path = payload.path;
      break;

    case "DELETE_RESOURCE": {
      const { path } = payload;

      specification.api = specification.api.filter(
        (api) => !api.path.startsWith(path)
      );

      if (pages.api.selected.path.startsWith(path)) {
        if (specification.api.length > 0) {
          pages.api.selected.path = specification.api[0].path;
          pages.api.selected.method = specification.api[0].method;
        } else {
          pages.api.selected.path = "/";
          pages.api.selected.method = "get";
        }

        publish("SELECTED_API_CHANGED", {
          path: pages.api.selected.path,
          method: pages.api.selected.method,
        });
      }

      break;
    }

    case "DELETE_METHOD": {
      const { path, method } = pages.api.selected;

      const routeIndex = specification.api.findIndex(
        (route) =>
          route.path === path &&
          route.method.toLowerCase() === method.toLowerCase()
      );

      if (routeIndex !== -1) {
        specification.api.splice(routeIndex, 1);
      }

      const samePathRoutes = specification.api.filter(
        (route) => route.path === path
      );
      if (samePathRoutes.length > 0) {
        context.pages.api.selected.method = samePathRoutes[0].method;
      } else {
        context.pages.api.selected.method = null;
      }

      break;
    }

    case "CLOSE_RESOURCE_MENU":
      pages.api.resourceMenu.open = false;
      pages.api.resourceMenu = {};
      break;

    case "OPEN_FUNCTION_DIALOG": {
      pages.functions.dialog.type = payload.type;
      pages.functions.dialog.open = true;
      break;
    }

    case "OPEN_AI_DIALOG": {
      const page = payload.page;
      pages[page].AIDialog.open = true;
      break;
    }

    case "CLOSE_AI_DIALOG": {
      const page = payload.page;
      pages[page].AIDialog.open = false;
      break;
    }

    case "SAVE_LOGIC_DIALOG": {
      const { description, summary, definition } = payload;
      const declarations = specification.declarations;

      declarations.push({
        description,
        summary,
        definition,
      });

      publish("LOGIC_ADDED", {
        declaration: declarations[declarations.length - 1],
      });

      break;
    }

    case "SAVE_FUNCTION_DIALOG": {
      const { path, type, definition, params, ext } = payload;
      const functions = specification.functions;

      functions.push({
        path,
        type,
        ext,
        definition,
        params,
      });

      publish("CONTEXT_CHANGED", {
        files: [{ key: `${path}.${ext}`, value: definition }],
      });

      break;
    }

    case "DELETE_FUNCTION": {
      const { path } = payload;

      if (specification.functions.length > 1) {
        const index = specification.functions.findIndex(
          (data) => data.path === path
        );

        const deletedFunction = specification.functions[index];
        specification.functions.splice(index, 1);

        const remainingFunctions = specification.functions.filter(
          (data) => data.path !== path
        );

        const files = remainingFunctions.map((func) => ({
          key: `${func.path}.ts`,
          value: func,
        }));

        publish("CONTEXT_CHANGED", {
          files: [{ key: `${deletedFunction.path}.ts` }, ...files],
        });
        context.pages.functions.selected = specification.functions[0].path;
      }

      break;
    }

    case "CLOSE_FUNCTION_DIALOG": {
      pages.functions.dialog.open = false;
      break;
    }

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

    case "QUERY_RESULTS": {
      const query = context.get("pages.query");
      query.results = payload.results;
      break;
    }

    case "CREATE_SAMPLE_CRUD": {
      const { api, functions } = specification;
      const className = payload.resource;
      const resource = payload.resource.toLowerCase() + "s";

      const template = {
        request: { type: "object", properties: {} },
        response: { type: "object", properties: {} },
      };

      api[`/${resource}`] = {
        get: {
          ...template,
          summary: `Get ${className} list`,
          description: `Get ${className} list`,
          action: `function action(req) {\n  return ${className};\n}\n`,
        },
        post: {
          ...template,
          summary: `Create ${className}`,
          description: `Create ${className}`,
          action: `function action(req) {\n  return new ${className}();\n}\n`,
        },
      };
      api[`/${resource}/{${resource}}`] = {
        get: {
          ...template,
          summary: `Get ${className}`,
          description: `Get ${className}`,
          action: `function action(req) {\n  const ${resource} = req.params.${resource};\n  return ${className}[${resource}];\n}\n`,
        },
        put: {
          ...template,
          summary: `Update ${className}`,
          description: `Update ${className}`,
          action: `function action(req) {\n  const ${resource} = req.params.${resource};\n  return ${className}[${resource}];\n}\n`,
        },
        del: {
          ...template,
          summary: `Delete ${className}`,
          description: `Delete ${className}`,
          action: `function action(req) {\n  const ${resource} = req.params.${resource};\n  delete ${className}[${resource}];\n}\n`,
        },
      };

      const sample = {
        definition: `class ${className} {\n  constructor() {\n  }\n}\n`,
        ext: "ts",
        params: [],
        path: `/${className}`,
        type: "CLASS",
      };

      functions.push(sample);

      publish("CONTEXT_CHANGED", {
        files: [
          { key: `${sample.path}.${sample.ext}`, value: sample.definition },
        ],
      });

      break;
    }
    case "UPDATE_API_SCHEMAS": {
      const { path, method, requestSchema, responseSchema } = payload;
      const apiIndex = specification.api.findIndex(
        (api) => api.path === path && api.method === method
      );

      if (apiIndex !== -1) {
        specification.api[apiIndex].request = {
          ...specification.api[apiIndex].request,
          schema: requestSchema,
        };
        specification.api[apiIndex].response = {
          ...specification.api[apiIndex].response,
          schema: responseSchema,
        };
      }
      break;
    }

    case "UPDATE_API_SUMMARY": {
      const { path, method, newSummary } = payload;
      const apiEndpoint = specification.api.find(
        (api) => api.path === path && api.method === method
      );
      if (apiEndpoint) {
        apiEndpoint.summary = newSummary;
      }
      break;
    }

    case "UPDATE_API_DESCRIPTION": {
      const { path, method, newDescription } = payload;
      const apiEndpoint = specification.api.find(
        (api) => api.path === path && api.method === method
      );
      if (apiEndpoint) {
        apiEndpoint.description = newDescription;
      }
      break;
    }

    case "DELETE_API": {
      const selectedIndex = specification.api.findIndex(
        (api) =>
          api.path === pages.api.selected.path &&
          api.method === pages.api.selected.method
      );

      if (selectedIndex > -1) {
        specification.api.splice(selectedIndex, 1);
        if (specification.api.length > 0) {
          pages.api.selected.path = specification.api[0].path;
          pages.api.selected.method = specification.api[0].method;
        } else {
          pages.api.selected.path = "/";
          pages.api.selected.method = "get";
        }
      }
      pages.api.dialog.open = false;

      break;
    }
    case "UPDATE_API_TYPES": {
      const { updatedTypes } = payload;
      const typeIndex = specification.types.findIndex(
        (type) => type.name === updatedTypes.name
      );
      const updatedType = {
        ...specification.types[typeIndex],
        schema: {
          ...updatedTypes,
        },
      };
      if (typeIndex !== -1) {
        specification.types[typeIndex] = updatedType;
      } else {
        specification.types.push(updatedTypes);
      }

      break;
    }
    case "ADD_TYPE": {
      const { typeName } = payload;
      const newType = {
        name: typeName,
        schema: {
          name: typeName,
          type: "object",
          properties: [
            { type: "string", name: "id" },
            { type: "string", name: "name" },
          ],
        },
      };
      specification.types.push(newType);

      break;
    }
    case "DELETE_TYPE": {
      const { typeName } = payload;
      const typeIndex = specification.types.findIndex(
        (type) => type.name === typeName
      );

      if (typeIndex !== -1) {
        specification.types.splice(typeIndex, 1);
      }

      break;
    }

    case "UPDATE_TYPE_NAME": {
      const { oldTypeName, newTypeName } = payload;
      const typeIndex = specification.types.findIndex(
        (type) => type.name === oldTypeName
      );

      if (typeIndex !== -1) {
        specification.types[typeIndex].name = newTypeName;
        specification.types[typeIndex].schema.name = newTypeName;
      }

      break;
    }
    case "SAVE_API_PARAMS": {
      console.log("SAVE_API_PARAMS", payload);
      const { path, method, params } = payload;
      const apiIndex = specification.api.findIndex(
        (api) => api.path === path && api.method === method
      );

      if (apiIndex !== -1) {
        specification.api[apiIndex].params = params;
      }

      break;
    }
    case "UPDATE_API_PATH_METHOD": {
      const { path, method } = payload;

      const apiIndex = specification.api.findIndex(
        (api) =>
          api.path === pages.api.selected.path &&
          api.method === pages.api.selected.method
      );

      if (apiIndex !== -1) {
        specification.api[apiIndex].path = path;
        specification.api[apiIndex].method = method;
      }

      pages.api.selected = {
        ...pages.api.selected,
        path: path,
        method: method,
      };

      break;
    }

    default:
  }

  const selectedContext = storage.get("ide", "selected", "context");

  if (selectedContext) {
    const { project } = storage.get("ide", "context", selectedContext.id);
    service.saveContext({ project, specification });
  }

  console.debug("contextReducer", type, context);
  return context;
}

export { contextReducer };
