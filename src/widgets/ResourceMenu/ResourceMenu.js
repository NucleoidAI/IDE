import DeleteIcon from "@mui/icons-material/Delete";
import HttpIcon from "@mui/icons-material/Http";
import React from "react";
import SourceIcon from "@mui/icons-material/Source";

import { useContext } from "../../context";
import { Divider, Menu, MenuItem } from "@mui/material";

export default function ResourceMenu(props) {
  const [state, dispatch] = useContext();
  const { anchor, path } = state.pages.api.resourceMenu;
  const [methodDisabled, setMethodDisabled] = React.useState();

  React.useEffect(() => {
    const checkMethodAddable = () => {
      const { pages, nucleoid } = state;
      const { api } = nucleoid;
      if (path) {
        return Object.keys(api[path]).length > 3 ? true : false;
      }

      if (pages.api.selected) {
        const apiSelectedPath = pages.api.selected.path;

        return Object.keys(api[apiSelectedPath]).length > 3 ? true : false;
      }
    };
    setMethodDisabled(checkMethodAddable());
  }, [state, path]);

  const { select, map } = props;

  const handleClose = () => {
    dispatch({
      type: "CLOSE_RESOURCE_MENU",
    });
  };

  const addMethod = () => {
    selectPath();
    dispatch({
      type: "OPEN_API_DIALOG",
      payload: { type: "method", action: "add" },
    });
    handleClose();
  };

  const addResource = () => {
    selectPath();
    dispatch({
      type: "OPEN_API_DIALOG",
      payload: { type: "resource", action: "add" },
    });
    handleClose();
  };

  const selectPath = () => {
    if (path) {
      dispatch({
        type: "SET_SELECTED_API",
        payload: { path: path, method: null },
      });

      select(
        window.btoa(
          JSON.stringify(
            Object.keys(map)
              .map((item) => map[item])
              .find((item) => item.path === path)
          )
        )
      );
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
        <MenuItem onClick={addResource}>
          <SourceIcon />
          Resource
        </MenuItem>
        <MenuItem onClick={addMethod} disabled={methodDisabled}>
          <HttpIcon />
          Method
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <DeleteIcon />
          Delete
        </MenuItem>
      </Menu>
    );
  } else return null;
}
