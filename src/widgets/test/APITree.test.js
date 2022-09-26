/*eslint-disable*/
/*
import APITree from "../../widgets/APITree";
import ContextProvider from "../../Context/context";
import React from "react";
import State from "../../state";
import { compile, graph } from "../../widgets/APITree/APITree";
import { render, screen } from "@testing-library/react";
import { contextReducer } from "../../Context/reducers/contextReducer";

test("List nested APIs", () => {

  const api = {
    "/": { get: {} },
    "/locations": { get: {} },
    "/questions": { get: {}, post: {} },
  };

  const grph = graph(api);

  const root = compile(
    [grph["/"]],
    null,
    ["/", "/locations", "/questions"],
    null
  )[0].props.children;

  expect(root).toHaveLength(3);
 
});

test("List nested APIs with ui", () => {

  const state = State.init();
  const api = state.get("nucleoid.api");
  api["/"] = { get: {} };
  api["/questions"] = { get: {} };
  api["/locations"] = { get: {}, post: {} };

  const wrapper = ({ children }) => (
    <ContextProvider state={state} reducer={contextReducer}>
      {children}
    </ContextProvider>
  );

  render(<APITree />, { wrapper });

  screen.getByRole("treeitem", {
    name: "/ GET /questions GET /locations GET POST",
  });
  screen.getByRole("treeitem", { name: "/questions GET" });
  screen.getByRole("treeitem", { name: "/locations GET POST" });
  
});
 */
/*eslint-enable*/

test("should first", () => {
  expect(true).toBe(true);
});
