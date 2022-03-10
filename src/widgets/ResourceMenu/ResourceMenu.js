import AlertMassage from "../../components/AlertMassage";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteResourceDialog from "../../components/DeleteResourceDialog";
import Fade from "@mui/material/Fade";
import HttpIcon from "@mui/icons-material/Http";
import React from "react";
import SourceIcon from "@mui/icons-material/Source";
import { useRef } from "react";
import { useStore } from "../../store";
import { Divider, Menu, MenuItem } from "@mui/material";

const ResourceMenu = (props) => {
  const [state, dispatch] = useStore();
  const { anchor, path } = state.pages.api.resourceMenu;
  const [methodDisabled, setMethodDisabled] = React.useState();
  const [alertMessage, setAlertMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const resourceRef = useRef();

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

  const deleteResource = () => {
    selectPath();
    dispatch({
      type: "DELETE_RESOURCE",
    });
    handleClose();
    setOpen(false);
  };

  const handleResourceDeleteDialog = () => {
    selectPath();

    if (state.pages.api.selected.path === "/") {
      setAlertMessage("Root path cannot be deleted");
      handleClose();
    } else {
      resourceRef.current = {
        deleteAdress: state.pages.api.selected,
        deleteList: Object.keys(state.nucleoid.api).filter((item) => {
          return item.includes(state.pages.api.selected.path);
        }),
      };

      handleClose();
      setOpen(true);
    }
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

  return (
    <>
      {open && (
        <DeleteResourceDialog
          open={open}
          setOpen={setOpen}
          deleteResource={deleteResource}
          ref={resourceRef}
        />
      )}
      {alertMessage && <AlertMassage message={alertMessage} />}
      {state.pages.api.resourceMenu.open && (
        <Menu
          open={Boolean(state.pages.api.resourceMenu.open)}
          onClose={handleClose}
          onContextMenu={(event) => event.preventDefault()}
          anchorReference="anchorPosition"
          anchorPosition={{ top: anchor.mouseY, left: anchor.mouseX }}
          TransitionComponent={Fade}
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
          <MenuItem onClick={handleResourceDeleteDialog}>
            <DeleteIcon />
            Delete
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default ResourceMenu;
