import APITree from "../../src/widgets/APITree/APITree";
import ContextProvider from "../../src/context/context";
import React from "react";
import State from "../../src/state";
import cy from "cypress";

describe("APITree Component", () => {
  it("should mount successfully", () => {
    const initialState = State.init();
    const mockReducer = (state) => {
      return state;
    };

    cy.mount(
      <ContextProvider state={initialState} reducer={mockReducer}>
        <APITree />
      </ContextProvider>
    );
  });
});
