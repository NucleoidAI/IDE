import APIDialog from "../../src/widgets/APIDialog/APIDialog";
import { Box } from "@mui/material";
import Context from "../../src/context";
import ContextProvider from "../../src/context/context";
import React from "react";

describe("APIDialog Component", () => {
  it("should open the dialog when triggered", () => {
    const initialState = Context.withSample();
    console.log(initialState);

    const mockReducer = (state, action) => {
      if (action.type === "OPEN_API_DIALOG") {
        state.pages.api.dialog.open = true;
        state.pages.api.dialog.type = action.payload.type;
        state.pages.api.dialog.action = action.payload.action;
      }
      return state;
    };

    cy.mount(
      <ContextProvider state={initialState} reducer={mockReducer}>
        <Box>
          <APIDialog />
        </Box>
      </ContextProvider>
    );

    cy.getBySel("api-body").should("be.visible");
  });
});
