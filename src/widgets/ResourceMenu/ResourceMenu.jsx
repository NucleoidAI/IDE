import AlertMassage from "../../components/AlertMassage";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteResourceDialog from "../../components/DeleteResourceDialog";
import Fade from "@mui/material/Fade";
import HttpIcon from "@mui/icons-material/Http";
import React from "react";
import SourceIcon from "@mui/icons-material/Source";
import styles from "./styles";
import { useContext } from "../../context/context";
import { useRef } from "react";

import { Divider, Menu, MenuItem, Typography } from "@mui/material";

const ResourceMenu = (props) => {
  const { anchor, openMenu, handleClose, hash, map } = props;

  const [state, dispatch] = useContext();
  const [methodDisabled, setMethodDisabled] = React.useState();
  const [alertMessage, setAlertMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const resourceRef = useRef();

  React.useEffect(() => {
    const checkMethodAddable = () => {
      const { pages, specification } = state;
      const { api } = specification;

      const countMethodsForPath = (path) => {
        return api.filter((endpoint) => endpoint.path === path).length;
      };

      if (hash) {
        const path = map ? map[hash].path : null;
        return countMethodsForPath(path) > 3;
      }

      if (pages.api.selected) {
        const apiSelectedPath = pages.api.selected.path;
        return countMethodsForPath(apiSelectedPath) > 4;
      }
      return false;
    };

    setMethodDisabled(checkMethodAddable());
  }, [state, hash, map]);

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
    const { pages } = state;
    dispatch({
      type: "DELETE_RESOURCE",
      payload: { path: pages.api.selected.path },
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
      const selectedPath = state.pages.api.selected.path;
      const deleteList = state.specification.api
        .filter(
          (item) =>
            item.path.startsWith(selectedPath) && item.path !== selectedPath
        )
        .map((item) => item.path)
        .filter((path, index, self) => self.indexOf(path) === index);

      resourceRef.current = {
        deleteAdress: selectedPath,
        deleteList: deleteList,
      };
      handleClose();
      setOpen(true);
    }
  };

  const selectPath = () => {
    const item = map ? map[hash] : null;

    if (item) {
      dispatch({
        type: "SET_SELECTED_API",
        payload: { path: item.path, method: null },
      });
    } else {
      dispatch({
        type: "SET_SELECTED_API",
        payload: { path: state.pages.api.selected.path, method: null },
      });
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
      {state.pages.api.resourceMenu.open && <></>}
      <Menu
        open={openMenu}
        onClose={handleClose}
        onContextMenu={(event) => event.preventDefault()}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: anchor?.clientY || 0,
          left: anchor?.clientX || 0,
        }}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={addResource} data-cy="add-resource">
          <SourceIcon />
          <Typography sx={styles.menuItemText}>Resource</Typography>
        </MenuItem>
        <MenuItem
          onClick={addMethod}
          disabled={methodDisabled}
          data-cy="add-method"
        >
          <HttpIcon />
          <Typography sx={styles.menuItemText}>Method</Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleResourceDeleteDialog}
          disabled={state.pages.api.selected?.path === "/"}
          data-cy="delete-resource"
        >
          <DeleteIcon />
          <Typography sx={styles.menuItemText}>Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ResourceMenu;
