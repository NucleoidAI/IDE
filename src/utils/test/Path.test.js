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

test("returns cloud when id is in correct UUID form", () => {
  const id = "f1f04060-1ea4-46fc-bbf9-fb69c1faca8b";
  window.location.pathname = `/${id}`;
  const mode = Path.getMode();
  expect(mode).toEqual("cloud");
});

test("returns search parameter when id is in correct UUID form and '?mode' query is provided", () => {
  const id = "f1f04060-1ea4-46fc-bbf9-fb69c1faca8b";
  window.location.pathname = `/${id}`;
  window.location.search = "?mode=MODE";
  const mode = Path.getMode();
  expect(mode).toEqual("MODE");
});

test("returns null when id is not in correct UUID form", () => {
  window.location.pathname = "/1111-1111";
  const mode = Path.getMode();
  expect(mode).toEqual(null);
});

test("returns null when id is not in correct UUID form and search parameter is provided", () => {
  window.location.pathname = "/1111-1111";
  window.location.search = "?mode=MODE";
  const mode = Path.getMode();
  expect(mode).toEqual(null);
});

test("returns mode when base path is not '/' ", () => {
  const id = "f1f04060-1ea4-46fc-bbf9-fb69c1faca8b";
  window.location.pathname = `/basename/${id}`;
  window.location.search = "?mode=MODE";
  const mode = Path.getMode();
  expect(mode).toEqual("MODE");
});
