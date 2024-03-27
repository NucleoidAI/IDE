import State from "../state";
import { contextReducer } from "../context/reducer";

jest.mock("@nucleoidai/react-event", () => {});

test("Resolve context with property", () => {
  const state = contextReducer(State.init(), {
    type: "SET_SELECTED_API",
    payload: { path: "/", method: "get" },
  });
  expect(state.get("pages.api.selected")).toEqual({ path: "/", method: "get" });
});

test("Resolve context with invalid property", () => {
  const state = contextReducer(State.init(), { type: "CLOSE_API_DIALOG" });
  expect(state.get("pages.apix.dialog.open")).toEqual(undefined);
});
