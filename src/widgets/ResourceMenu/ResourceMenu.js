import React from "react";
import { useContext } from "../../context";
import { Divider, Menu, MenuItem } from "@mui/material";


export default function ResourceMenu(props) {
  const [state, dispatch] = useContext();
  const anchor = state.pages.api.resourceMenu.anchor;

  const handleClose = () => {
    dispatch({
      type: "CLOSE_RESOURCE_MENU",
    });
  };

  const addMethod = () => {
    dispatch({
      type: "OPEN_API_DIALOG",
      payload: { type: "add" },
    });
    handleClose();
  };

  const checkMethodAddable = () => {
    const { pages, nucleoid } = state;
    const { api } = nucleoid;
    if (pages.api.selected) {
      const path = pages.api.selected.path;

      return Object.keys(api[path]).length > 3 ? true : false;
    }
  };

  if (state.pages.api.resourceMenu.open) {
    return (
      <Menu
        open={Boolean(state.pages.api.resourceMenu.open)}
        onClose={handleClose}
        onContextMenu={(event) => event.preventDefault()}
        anchorReference="anchorPosition"
        anchorPosition={{ top: anchor.mouseY, left: anchor.mouseX }}
      >
        <MenuItem onClick={handleClose}>Resource</MenuItem>
        <MenuItem onClick={addMethod} disabled={checkMethodAddable()}>
          Method
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    );
  } else return null;
}
