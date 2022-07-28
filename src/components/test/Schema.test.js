import SchemaArray from "../SchemaArray";
import SchemaObject from "../SchemaObject";
import SchemaProperty from "../SchemaProperty";
import { compile } from "../Schema";
import { compile as compileSchema } from "../../widgets/APIDialog/Context";
import { compile as mapSchema } from "../../utils/Map";
import { render, screen } from "@testing-library/react";

test("List properties of schema", () => {
  const schema = {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
      name: {
        type: "string",
      },
    },
  };

  const compiledSchema = compileSchema(schema);
  const map = mapSchema(compiledSchema);
  const content = compile(true, map, compiledSchema, null, []);

  render(content);

  //screen.getByRole("treeitem", { name: "name" });

  //const txt = screen.getByText(/id/i);
  /*
  const child1 = root.children().first();
  expect(child1.type()).toEqual(SchemaProperty);
  expect(child1.prop("name")).toEqual("id");
  expect(child1.prop("type")).toEqual("integer");

  const child2 = root.children().at(1);
  expect(child2.type()).toEqual(SchemaProperty);
  expect(child2.prop("name")).toEqual("text");
  expect(child2.prop("type")).toEqual("string");
  */
});

test("List array as property of schema", () => {
  /*
  const schema = {
    type: "object",
    properties: {
      list: {
        type: "array",
        items: {
          type: "integer",
        },
      },
    },
  };

  const compiledSchema = compileSchema(schema);
  const map = mapSchema(compiledSchema);
  const root = shallow(compile(true, map, compiledSchema, null, []));

  const child = root.children().first();
  expect(child.type()).toEqual(SchemaArray);
  expect(child.prop("name")).toEqual("list");
  expect(child.prop("type")).toEqual("array");
  */
});

test("List nested object in schema", () => {
  /*
  const schema = {
    type: "object",
    properties: {
      user: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
        },
      },
    },
  };

  const compiledSchema = compileSchema(schema);
  const map = mapSchema(compiledSchema);
  const root = shallow(compile(true, map, compiledSchema, null, []));

  const child = root.children().first();
  expect(child.type()).toEqual(SchemaObject);
  //expect(child.prop("name")).toEqual("user");
  // TODO refactor test
  const nested = child.children().first();
  expect(nested.prop("name")).toEqual("id");
  expect(nested.prop("type")).toEqual("integer");
  */
});
