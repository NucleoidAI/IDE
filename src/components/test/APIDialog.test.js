import { compile, decompile, deindex, index } from "../APIDialog";

test("Compile and decompile schema", () => {
  const schema = {
    type: "object",
    properties: {
      id: {
        type: "integer",
      },
      name: {
        type: "string",
      },
      list: {
        type: "array",
        items: {
          type: "integer",
        },
      },
      object: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
        },
      },
    },
  };

  const map = {};
  const object = compile(map, schema);
  const result = decompile(map, object);
  expect(result).toEqual(schema);
});

test("Index and deindex params", () => {
  const params = [
    {
      name: "order",
      type: "string",
    },
    {
      name: "item",
      type: "integer",
    },
  ];

  const map = {};
  const object = index(map, params);
  const result = deindex(object);
  expect(result).toEqual(params);
});
