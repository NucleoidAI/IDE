import Project from "../Project.js";
import chatData from "./chatData.json";

let blocks;

beforeAll(() => {
  blocks = chatData.messages
    .filter((message) => message.code)
    .map((message) => message.code);
});

test("compiles class block", () => {
  const result = Project.compile(blocks);

  expect(result.functions[0].path).toBe("/User");
  expect(result.functions[0].params).toEqual([
    "firstName: string",
    "lastName: string",
  ]);
  expect(result.functions[0].type).toBe("CLASS");
  expect(result.api[0].path).toBe("/users");
  expect(result.api[0].method).toBe("GET");
  expect(result.api[1].path).toBe("/users");
  expect(result.api[1].method).toBe("POST");
  expect(result.api[2].path).toBe("/users/{UserId}");
  expect(result.api[2].method).toBe("GET");
});

test("compiles declaration blocks", () => {
  const result = Project.compile(blocks);

  expect(result.declarations[0].definition.replace(/\s/g, "")).toBe(
    "$User.fullName=$User.firstName+''+$User.lastName;"
  );
  expect(result.declarations[1].definition.replace(/\s/g, "")).toBe(
    "$User.initials=$User.firstName.charAt(0)+$User.lastName.charAt(0);"
  );
});

test("ignores imperative block", () => {
  const imperativeBlock = blocks.find((block) =>
    block.includes("'use imperative';")
  );

  const result = Project.compile([imperativeBlock]);

  expect(result.functions).toEqual([]);
  expect(result.declarations).toEqual([]);
});
