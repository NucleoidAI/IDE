import APITree from "../../src/widgets/APITree/APITree";
import ContextProvider from "../../src/context/context";
import React from "react";
import State from "../../src/state";
import { contextreducer } from "../../src/context/reducers/contextreducer";

describe("APITree Component", () => {
  it("should mount successfully", () => {
    const initialState = State.init();
    const mockReducer = (state, action) => {
      return state;
    };

    cy.mount(
      <ContextProvider state={initialState} reducer={mockReducer}>
        <APITree />
      </ContextProvider>
    );
  });
});
