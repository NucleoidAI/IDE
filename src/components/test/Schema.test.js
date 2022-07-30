import SchemaArray from "../SchemaArray";
import SchemaObject from "../SchemaObject";
import SchemaProperty from "../SchemaProperty";
import { compile } from "../Schema";
import { compile as compileSchema } from "../../widgets/APIDialog/Context";
import { compile as mapSchema } from "../../utils/Map";

test("List properties of schema", () => {
  const schema = {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
      age: {
        type: "integer",
      },
    },
  };

  const compiledSchema = compileSchema(schema);
  const map = mapSchema(compiledSchema);
  const root = compile(true, map, compiledSchema, null, ["/"], null);

  expect(root.type).toEqual(SchemaObject);

  const firstChild = root.props.children;
  expect(firstChild[0].type).toEqual(SchemaProperty);
  expect(firstChild[0].props["name"]).toEqual("id");
  expect(firstChild[0].props["type"]).toEqual("string");

  expect(firstChild[1].type).toEqual(SchemaProperty);
  expect(firstChild[1].props["name"]).toEqual("age");
  expect(firstChild[1].props["type"]).toEqual("integer");
});

test("List array as property of schema", () => {
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
  const root = compile(true, map, compiledSchema, null, ["/"], null);

  expect(root.type).toEqual(SchemaObject);

  const firstChild = root.props.children[0];
  expect(firstChild.type).toEqual(SchemaArray);
  expect(firstChild.props["name"]).toEqual("list");
  expect(firstChild.props["type"]).toEqual("array");

  const secondChild = firstChild.props.children[0];
  expect(secondChild.type).toEqual(SchemaProperty);
  expect(secondChild.props["type"]).toEqual("integer");
});

test("List nested object in schema", () => {
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
  const root = compile(true, map, compiledSchema, null, ["/"], null);

  expect(root.type).toEqual(SchemaObject);

  const firstChild = root.props.children[0];
  expect(firstChild.type).toEqual(SchemaObject);
  expect(firstChild.props["name"]).toEqual("user");

  const secondChild = firstChild.props.children[0];
  expect(secondChild.type).toEqual(SchemaProperty);
  expect(secondChild.props["name"]).toEqual("id");
  expect(secondChild.props["type"]).toEqual("integer");
});
