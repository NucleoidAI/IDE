import APIDialog from "../../src/widgets/APIDialog/APIDialog";
import { Box } from "@mui/material";
import Context from "../../src/context";
import ContextProvider from "../../src/context/context";
import React from "react";

describe("APIDialog Component", () => {
  it("should open the dialog when triggered", () => {
    const initialState = Context.withSample();

    initialState.pages.api.dialog = {
      open: true,
      type: "method",
      action: "edit",
    };
    initialState.pages.api.selected = {
      path: "/items",
      method: "POST",
    };
    initialState.pages.api.dialog.view = "BODY";

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
