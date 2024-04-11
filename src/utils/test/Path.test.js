import Path from "../Path.js";
import { storage } from "@nucleoidjs/webstorage";

jest.mock("@nucleoidjs/webstorage", () => {
  const memory = new Map();
  return {
    storage: {
      get: jest.fn((...args) => memory.get(args.join("."))),
      set: jest.fn((...args) => {
        const value = args.pop();
        memory.set(args.join("."), value);
      }),
      clear: jest.fn(() => memory.clear()),
    },
  };
});

// eslint-disable-next-line no-global-assign
window = Object.create(window);

Object.defineProperty(window, "location", {
  value: {
    href: "http://nucleoid.com",
  },
  writable: true,
});

const paths = [
  "/",
  "/devices",
  "/questions",
  "/questions/reviews",
  "/questions/reviews2",
  "/questions/reviews/{rev3}",
  "/questions/reviews/{rev3}/items",
];

beforeEach(() => storage.clear());

test("splits prefix and suffix", () => {
  const { prefix, suffix } = Path.split("/questions/reviews/{rev3}/items");
  expect(prefix).toEqual("/questions/reviews/{rev3}");
  expect(suffix).toEqual("items");
});

test("returns false when the path is the same as the old path", () => {
  const result = Path.isUsed(paths, "/questions", "reviews", "reviews");
  expect(result).toEqual(false);
});

test("returns true when the new path is empty", () => {
  const result = Path.isUsed(paths, "/questions", "reviews", "");
  expect(result).toEqual(true);
});

test("returns true when the new path is already used", () => {
  const result = Path.isUsed(paths, "/questions", "reviews", "reviews2");
  expect(result).toEqual(true);
});

test("returns false when the new path is not used", () => {
  const result = Path.isUsed(paths, "/questions", "reviews", "invalid");
  expect(result).toEqual(false);
});

test("returns the project id", () => {
  window.location.pathname =
    "/projects/f1f04060-1ea4-46fc-bbf9-fb69c1faca8b/api";
  const id = Path.getProjectId();
  expect(id).toEqual("f1f04060-1ea4-46fc-bbf9-fb69c1faca8b");
});

test("returns the selected project in storage", () => {
  const projectId = "f1f04060-1ea4-46fc-bbf9-fb69c1faca8b";

  storage.set("ide", "selected", "project", projectId);

  expect(storage.set).toHaveBeenCalledWith(
    "ide",
    "selected",
    "project",
    projectId
  );

  const recentProject = Path.getRecentProject();
  expect(recentProject).toEqual(projectId);
});

test("returns null when the selected project is not found", () => {
  storage.set("ide", "selected", "project", null);
  const recentProject = Path.getRecentProject();
  expect(recentProject).toEqual(null);
});

test("returns the mode from the URL", () => {
  window.location.search = "?mode=local";
  const mode = Path.getMode();
  expect(mode).toEqual("local");
});

test("returns the mode from the project id", () => {
  window.location.search = "";
  window.location.pathname = "ide/f1f04060-1ea4-46fc-bbf9-fb69c1faca8b/api";
  const mode = Path.getMode();
  expect(mode).toEqual("cloud");
});

test("returns null when the mode is not found", () => {
  window.location.search = "";
  window.location.pathname = "ide/api";
  const mode = Path.getMode();
  expect(mode).toEqual(null);
});
