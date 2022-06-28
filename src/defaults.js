const Defaults = {
  compiledObject: (objID, objPropID) => {
    return {
      [objID]: {
        type: "object",
        id: objID,
        properties: {
          [objPropID]: {
            id: objPropID,
            name: "id",
            type: "string",
          },
        },
      },
    };
  },
  compiledProperty: (id) => {
    return {
      [id]: {
        id: id,
        name: "id",
        type: "string",
      },
    };
  },
  object: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
  },
  array: {
    type: "array",
    items: {
      id: {
        type: "string",
      },
    },
  },
  action: `function action(req) {\n\treturn req.body.name;\n}\n`,
  summary: "Summary",
  description: "Description",
};

export default Defaults;
