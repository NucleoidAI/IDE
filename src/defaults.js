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
            type: "integer",
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
        type: "integer",
      },
    };
  },
  object: {
    type: "object",
    properties: {
      id: {
        type: "integer",
      },
    },
  },
  array: {
    type: "array",
    items: {
      id: {
        type: "integer",
      },
    },
  },
  action: `function action(req) {\n\treturn req.body.name;\n}\n`,
  summary: "Summary",
  description: "Description",
};

export default Defaults;
