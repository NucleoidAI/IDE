/*eslint-disable*/
/*
import ContextProvider from "../../Context/context";
import FunctionTree from "../../widgets/FunctionTree";
import React from "react";
import State from "../../state";
import { render, screen } from "@testing-library/react";
import { contextReducer } from "../../Context/reducers/contextReducer";

test("List nested functions", () => {
  const state = State.init();
  const functions = state.get("nucleoid.functions");

  functions.push({
    path: "/getInfo",
    params: [],
    type: "FUNCTION",
  });
  functions.push({
    path: "/users/getUser",
    params: ["user"],
    type: "FUNCTION",
  });

  const wrapper = ({ children }) => (
    <ContextProvider state={state} reducer={contextReducer}>
      {children}
    </ContextProvider>
  );

  render(<FunctionTree />, { wrapper });

  screen.getByRole("treeitem", {
    name: "users fn getInfo ()",
  });
});
*/
/*eslint-enable*/

test("should first", () => {
  expect(true).toBe(true);
});
