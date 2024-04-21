import APITree from "../../src/widgets/APITree/APITree";
import Context from "../../src/context";
import ContextProvider from "../../src/context/context";
import React from "react";
import cy from "cypress";

// TODO Revisit component tests
describe("APITree Component", () => {
  it("should mount successfully", () => {
    const initialState = Context.init();
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
