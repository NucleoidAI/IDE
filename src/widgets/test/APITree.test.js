import APITree from "../APITree";
import React from "react";
import State from "../../state";
import { render, screen } from "@testing-library/react";
import { ContextProvider } from "../../Context/providers/contextProvider";
import { contextReducer } from "Context/reducers/contextReducer";

test("List nested APIs", () => {
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
