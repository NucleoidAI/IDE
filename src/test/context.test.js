import Context from "../context";
import { contextReducer } from "../context/reducer";
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

jest.mock("@nucleoidai/react-event", () => ({
  publish: jest.fn(),
}));

beforeEach(() => {
  storage.set("ide", "selected", "project", {
    id: "21d2530b-4657-4ac0-b8cd-1a9f82786e32",
  });
  storage.set(
    "ide",
    "project",
    "21d2530b-4657-4ac0-b8cd-1a9f82786e32",
    Context.withBlank()
  );
});

test("Resolve context with property", () => {
  const state = contextReducer(Context.init(), {
    type: "SET_SELECTED_API",
    payload: { path: "/", method: "get" },
  });
  expect(state.get("pages.api.selected")).toEqual({ path: "/", method: "get" });
});

test("Resolve context with invalid property", () => {
  const state = contextReducer(Context.init(), { type: "CLOSE_API_DIALOG" });
  expect(state.get("pages.apix.dialog.open")).toEqual(undefined);
});
