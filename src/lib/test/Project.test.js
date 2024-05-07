import Project from "../Project.js";
import { blocks } from "./blocks.js";

test("compiles class block", () => {
  const result = Project.compile(blocks);

  expect(result.functions[0].path).toBe("/User");
  expect(result.functions[0].params).toEqual([
    "firstName: string",
    "lastName: string",
  ]);
  expect(result.functions[0].type).toBe("CLASS");
  expect(result.api[1].path).toBe("/users");
  expect(result.api[1].method).toBe("GET");
  expect(result.api[2].path).toBe("/users");
  expect(result.api[2].method).toBe("POST");
  expect(result.api[3].path).toBe("/users/{userId}");
  expect(result.api[3].method).toBe("GET");
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

test("ignores imperative block without 'use imperative'", () => {
  const imperativeBlockWithoutDirective =
    "User.filter(u => u.firstName === 'John');";
  const result = Project.compile([imperativeBlockWithoutDirective]);
  expect(result.functions).toEqual([]);
  expect(result.declarations).toEqual([]);
});
