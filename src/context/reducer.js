import Context from "../context";
import { publish } from "@nucleoidai/react-event";
import { v4 as uuid } from "uuid";

function contextReducer(context, { type, payload }) {
  context = Context.copy(context);

  const { specifications, pages } = context;

  switch (type) {
    case "SET_PROJECT": {
      specifications.api = payload.project.specifications.api;
      specifications.functions = payload.project.specifications.functions;
      specifications.types = payload.project.specifications.types;
      pages.api.selected.path = "/";

      break;
    }

    case "OPEN_API_DIALOG": {
      pages.api.dialog.type = payload.type;
      pages.api.dialog.action = payload.action;
      pages.api.dialog.open = true;
      break;
    }

    case "SAVE_API_DIALOG": {
      const { request, response, params, types } = payload;

      let method = pages.api.selected.method;
      const path = pages.api.selected.path;
      const api = specifications.api;

      if (
        pages.api.dialog.type === "method" &&
        pages.api.dialog.action === "add"
      ) {
        api[path][payload.method] = {};
        pages.api.selected.method = payload.method;
        api[path][payload.method].request = payload.request;
        api[path][payload.method].response = payload.response;
        api[path][payload.method].params = payload.params;
        api[path][payload.method]["x-nuc-action"] = payload.action;
        api[path][payload.method].summary = payload.summary;
        api[path][payload.method].description = payload.description;

        specifications.types = payload.types;

        break;
      }

      if (
        pages.api.dialog.type === "resource" &&
        pages.api.dialog.action === "add"
      ) {
        const path = payload.path;
        const method = payload.method;

        api[path] = { [method]: {} };
        pages.api.selected.method = payload.method;
        api[path][method].request = payload.request;
        api[path][method].response = payload.response;
        api[path][method].params = payload.params;
        api[path][payload.method]["x-nuc-action"] = payload.action;
        api[path][payload.method].summary = payload.summary;
        api[path][payload.method].description = payload.description;

        specifications.types = payload.types;

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
      //api[path][method].action = payload.action;
      //api[path][method].summary = payload.summary;
      //api[path][method].description = payload.description;
      specifications.types = types;
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
        const endpoint = specifications.api.find(
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
      const newObj = {};
      // TODO functional programming
      Object.keys(context.specifications.api)
        .filter((item) => !item.includes(context.pages.api.selected.path))
        .forEach(
          (objName) => (newObj[objName] = context.specifications.api[objName])
        );

      context.specifications.api = newObj;
      context.pages.api.selected.path = "/";
      context.pages.api.selected.method = "get";
      break;
    }

    case "DELETE_METHOD": {
      const { path, method } = pages.api.selected;

      const routeIndex = specifications.api.findIndex(
        (route) =>
          route.path === path &&
          route.method.toLowerCase() === method.toLowerCase()
      );

      if (routeIndex !== -1) {
        specifications.api.splice(routeIndex, 1);
      }

      const samePathRoutes = specifications.api.filter(
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
      const declarations = specifications.declarations;

      declarations.push({
        description,
        summary,
        definition,
      });
      pages.logic.selected = declarations[declarations.length - 1];

      break;
    }

    case "SAVE_FUNCTION_DIALOG": {
      const { path, type, definition, params, ext } = payload;
      const functions = specifications.functions;

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

      if (specifications.functions.length > 1) {
        const index = specifications.functions.findIndex(
          (data) => data.path === path
        );

        const fn = specifications.functions[index];
        specifications.functions.splice(index, 1);

        publish("CONTEXT_CHANGED", {
          files: [{ key: `${fn.path}.${fn.ext}` }],
        });
        context.pages.functions.selected = specifications.functions[0].path;
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
      const { api, functions } = specifications;
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
          "x-nuc-action": `function action(req) {\n  return ${className};\n}\n`,
        },
        post: {
          ...template,
          summary: `Create ${className}`,
          description: `Create ${className}`,
          "x-nuc-action": `function action(req) {\n  return new ${className}();\n}\n`,
        },
      };
      api[`/${resource}/{${resource}}`] = {
        get: {
          ...template,
          summary: `Get ${className}`,
          description: `Get ${className}`,
          "x-nuc-action": `function action(req) {\n  const ${resource} = req.params.${resource};\n  return ${className}[${resource}];\n}\n`,
        },
        put: {
          ...template,
          summary: `Update ${className}`,
          description: `Update ${className}`,
          "x-nuc-action": `function action(req) {\n  const ${resource} = req.params.${resource};\n  return ${className}[${resource}];\n}\n`,
        },
        del: {
          ...template,
          summary: `Delete ${className}`,
          description: `Delete ${className}`,
          "x-nuc-action": `function action(req) {\n  const ${resource} = req.params.${resource};\n  delete ${className}[${resource}];\n}\n`,
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
      const apiIndex = specifications.api.findIndex(
        (api) => api.path === path && api.method === method
      );

      if (apiIndex !== -1) {
        specifications.api[apiIndex].request = {
          ...specifications.api[apiIndex].request,
          schema: requestSchema,
        };
        specifications.api[apiIndex].response = {
          ...specifications.api[apiIndex].response,
          schema: responseSchema,
        };
      }
      break;
    }

    case "UPDATE_API_SUMMARY": {
      const { path, method, newSummary } = payload;
      const apiEndpoint = specifications.api.find(
        (api) => api.path === path && api.method === method
      );
      if (apiEndpoint) {
        apiEndpoint.summary = newSummary;
      }
      break;
    }

    case "UPDATE_API_DESCRIPTION": {
      const { path, method, newDescription } = payload;
      const apiEndpoint = specifications.api.find(
        (api) => api.path === path && api.method === method
      );
      if (apiEndpoint) {
        apiEndpoint.description = newDescription;
      }
      break;
    }

    case "DELETE_API": {
      const selectedIndex = specifications.api.findIndex(
        (api) =>
          api.path === pages.api.selected.path &&
          api.method === pages.api.selected.method
      );

      if (selectedIndex > -1) {
        specifications.api.splice(selectedIndex, 1);
        if (specifications.api.length > 0) {
          pages.api.selected.path = specifications.api[0].path;
          pages.api.selected.method = specifications.api[0].method;
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
      const typeIndex = specifications.types.findIndex(
        (type) => type.name === updatedTypes.name
      );
      const updatedType = {
        ...specifications.types[typeIndex],
        schema: {
          ...updatedTypes,
        },
      };
      if (typeIndex !== -1) {
        specifications.types[typeIndex] = updatedType;
      } else {
        specifications.types.push(updatedTypes);
      }
      break;
    }
    case "ADD_TYPE": {
      const { typeName } = payload;
      const newType = {
        name: typeName,
        type: "OPENAPI",
        schema: {
          name: typeName,
          type: "object",
          properties: [
            { type: "string", name: "id" },
            { type: "string", name: "name" },
          ],
        },
      };
      specifications.types.push(newType);
      break;
    }
    case "DELETE_TYPE": {
      const { typeName } = payload;
      const typeIndex = specifications.types.findIndex(
        (type) => type.name === typeName
      );

      if (typeIndex !== -1) {
        specifications.types.splice(typeIndex, 1);
      }
      break;
    }

    case "UPDATE_TYPE_NAME": {
      const { oldTypeName, newTypeName } = payload;
      const typeIndex = specifications.types.findIndex(
        (type) => type.name === oldTypeName
      );

      if (typeIndex !== -1) {
        specifications.types[typeIndex].name = newTypeName;
        specifications.types[typeIndex].schema.name = newTypeName;
      }
      break;
    }
    case "SAVE_API_PARAMS": {
      console.log("SAVE_API_PARAMS", payload);
      const { path, method, params } = payload;
      const apiIndex = specifications.api.findIndex(
        (api) => api.path === path && api.method === method
      );

      if (apiIndex !== -1) {
        specifications.api[apiIndex].params = params;
      }
      break;
    }

    default:
  }

  console.debug("contextReducer", type, context);
  return context;
}

export { contextReducer };
