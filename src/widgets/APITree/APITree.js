import ArrowIcon from "../../icons/Arrow";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteMethodDialog from "../../components/DeleteMethodDialog";
import EditIcon from "@mui/icons-material/Edit";
import Fade from "@mui/material/Fade";
import NonExpandableTreeItem from "../../components/NonExpandableTreeItem";
import ResourceMenu from "../ResourceMenu";
import styles from "./styles";
import { useNucleoidStore } from "../../Context/providers/NucleoidStoreProvider";
import { Box, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TreeItem, TreeView } from "@mui/lab";

const map = {};

function APITree() {
  const [selected, setSelected] = React.useState(null);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [methodDisabled, setMethodDisabled] = useState();
  const [open, setOpen] = useState(false);

  const [state, dispatch] = useNucleoidStore();
  const api = state.get("nucleoid.api");
  const list = Object.keys(api).map((key) => ({
    path: key,
    methods: Object.keys(api[key]),
  }));

  const select = (id) => {
    if (map[id]) {
      setSelected(id);
      dispatch({ type: "SET_SELECTED_API", payload: map[id] });
    }
  };

  const handleContextMenu = (event, hash) => {
    event.preventDefault();

    if (hash) select(hash);
    setContextMenu(
      !contextMenu
        ? {
            mouseX: event.clientX,
            mouseY: event.clientY,
          }
        : null
    );
  };

  const handleResourceMenu = (event, path) => {
    event.preventDefault();

    dispatch({
      type: "OPEN_RESOURCE_MENU",
      payload: {
        path: path,
        anchor: {
          mouseX: event.clientX,
          mouseY: event.clientY,
        },
      },
    });
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const editMethod = () => {
    dispatch({
      type: "OPEN_API_DIALOG",
      payload: { type: "method", action: "edit" },
    });
    handleClose();
  };

  const deleteMethod = () => {
    dispatch({ type: "DELETE_METHOD" });
    setOpen(false);
  };

  const handleDeleteMethod = () => {
    setOpen(true);
    handleClose();
  };

  const checkMethodDeletable = () => {
    const { pages, nucleoid } = state;
    const { api } = nucleoid;
    const path = pages.api.selected.path;
    if (pages.api) {
      return Object.keys(api[path]).length <= 1 ? true : false;
    }
  };

  useEffect(() => {
    if (!selected) {
      select(Object.keys(map).pop());
    }
    setMethodDisabled(checkMethodDeletable());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, state]);

  const graph = {};

  list.forEach((each) => {
    const parts = each.path.substring(1).split("/");
    const label = "/" + parts.pop();
    const parent = "/" + parts.join("/");

    const node = {
      label,
      path: each.path,
      resources: [],
      methods: each.methods,
    };

    if (graph[parent]) graph[parent].resources.push(node);

    graph[each.path] = node;
  });

  return (
    <>
      {open && (
        <DeleteMethodDialog setOpen={setOpen} deleteMethod={deleteMethod} />
      )}
      <TreeView
        defaultCollapseIcon={<ArrowIcon down />}
        defaultExpandIcon={<ArrowIcon right />}
        defaultExpanded={list.map((api) => api.path)}
        onNodeSelect={(event, value) => select(value)}
        selected={selected}
      >
        {compile([graph["/"]], handleContextMenu, handleResourceMenu)}
      </TreeView>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        onContextMenu={(event) => event.preventDefault()}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => {
            editMethod();
          }}
        >
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteMethod} disabled={methodDisabled}>
          <DeleteIcon /> Delete
        </MenuItem>
      </Menu>
      <ResourceMenu select={select} map={map} />
    </>
  );
}

const compile = (list, handleContextMenu, handleResourceMenu) =>
  list.map((api) => {
    let children = undefined;

    if (api.resources && api.resources.length > 0) {
      children = compile(api.resources, handleContextMenu, handleResourceMenu);
    }

    children = api.methods
      .map((method) => {
        const payload = { path: api.path, method };
        const hash = window.btoa(JSON.stringify(payload));
        map[hash] = payload;

        return (
          <TreeItem
            key={hash}
            nodeId={hash}
            onContextMenu={(event) => handleContextMenu(event, hash)}
            label={
              <Box sx={styles.apiTreeItem}>
                <center>{method.toUpperCase()}</center>
              </Box>
            }
          />
        );
      })
      .concat(children);

    return (
      <NonExpandableTreeItem
        key={api.path}
        nodeId={api.path}
        label={api.label}
        children={children}
        onClick={(e) => {
          if (e.type === "contextmenu") {
            handleResourceMenu(e, api.path);
          }
        }}
      />
    );
  });

export default APITree;
