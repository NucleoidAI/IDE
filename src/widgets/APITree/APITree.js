import ArrowIcon from "../../icons/Arrow";
import NonExpandableTreeItem from "../../components/NonExpandableTreeItem";
import styles from "./styles";
import { useContext } from "../../context";
import { Box, Menu, MenuItem } from "@mui/material";
import React, { useEffect } from "react";
import { TreeItem, TreeView } from "@mui/lab";
const map = {};

function APITree() {
  const [selected, setSelected] = React.useState(null);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [resourceMenu, setResourceMenu] = React.useState(null);
  const [state, dispatch] = useContext();
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
    console.log(path);

    //if (hash) select(hash);
    setResourceMenu(
      !contextMenu
        ? {
            mouseX: event.clientX,
            mouseY: event.clientY,
          }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
    setResourceMenu(null);
  };

  useEffect(() => {
    if (!selected) {
      select(Object.keys(map).pop());
    }
  });

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
      >
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
      <Menu
        open={resourceMenu !== null}
        onClose={handleClose}
        onContextMenu={(event) => event.preventDefault()}
        anchorReference="anchorPosition"
        anchorPosition={
          resourceMenu !== null
            ? { top: resourceMenu.mouseY, left: resourceMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleClose}>Method</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
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
        const hash = btoa(JSON.stringify(payload));
        map[hash] = payload;

        return (
          <TreeItem
            key={hash}
            nodeId={hash}
            onContextMenu={(event) => handleContextMenu(event, api.path)}
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
