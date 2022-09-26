import AddIcon from "@mui/icons-material/Add";
import ArrowIcon from "../../icons/Arrow";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteMethodDialog from "../../components/DeleteMethodDialog";
import EditIcon from "@mui/icons-material/Edit";
import Fade from "@mui/material/Fade";
import NonExpandableAPITreeItem from "../../components/NonExpandableAPITreeItem";
import ResourceMenu from "../ResourceMenu";
import styles from "./styles";
import { subscribe } from "../../Event";
import theme from "../../theme";
import { useContext } from "../../Context/context";
import {
  Box,
  Card,
  CardActions,
  Fab,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TreeItem, TreeView } from "@mui/lab";

const map = {};

function APITree() {
  const [selected, setSelected] = React.useState(null);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [rightClickMethod, setRightClickMethod] = React.useState();
  const [methodDisabled, setMethodDisabled] = useState();
  const [open, setOpen] = useState(false);
  const [resourceMenu, setResourceMenu] = React.useState(false);
  const [anchor, setAnchor] = React.useState();
  const [expanded, setExpanded] = useState([]);
  const [errors, setErrors] = useState([]);

  const [state, dispatch] = useContext();
  const api = state.get("nucleoid.api");
  const grph = graph(api);

  const expandList = [];

  const handleToggle = (event, ids) => {
    setExpanded(ids);
  };

  const handleExpandClick = () => {
    setExpanded([...expandList]);
  };

  const select = (id) => {
    if (map[id]) {
      setSelected(id);
      dispatch({ type: "SET_SELECTED_API", payload: map[id] });
    }
  };

  const handleContextMenu = (event, hash) => {
    event.preventDefault();

    if (hash) select(hash);

    setRightClickMethod(hash);

    setContextMenu(
      !contextMenu
        ? {
            mouseX: event.clientX,
            mouseY: event.clientY,
          }
        : null
    );
  };

  const handleResourceMenu = (event) => {
    event.preventDefault();

    setResourceMenu(true);
    setAnchor(event);
  };

  const handleCloseResourceMenu = () => {
    setResourceMenu(false);
  };

  const handleClose = () => {
    setRightClickMethod(null);
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

    if (pages.api.selected) {
      const path = pages.api.selected.path;
      return Object.keys(api[path]).length <= 1 ? true : false;
    }
  };

  useEffect(() => {
    const event = subscribe("DIAGNOSTICS_COMPLETED", (diagnostics) =>
      setErrors(diagnostics)
    );

    if (!selected) {
      select(Object.keys(map).pop());
    }
    setMethodDisabled(checkMethodDeletable());
    handleExpandClick();

    return () => event.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, state]);

  return (
    <Card sx={styles.apiTree}>
      <Grid sx={styles.apiTreeGrid}>
        {open && (
          <DeleteMethodDialog setOpen={setOpen} deleteMethod={deleteMethod} />
        )}
        <TreeView
          defaultCollapseIcon={<ArrowIcon down />}
          defaultExpandIcon={<ArrowIcon right />}
          onNodeToggle={handleToggle}
          expanded={expanded}
          onNodeSelect={(event, value) => select(value)}
          selected={selected}
          sx={{ bgcolor: errors.length > 0 && "#f7afafab" }}
        >
          {compile(
            [grph["/"]],
            handleContextMenu,
            expandList,
            rightClickMethod
          )}
        </TreeView>
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
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
            <Typography sx={styles.menuItemText}>Edit</Typography>
          </MenuItem>
          <MenuItem onClick={handleDeleteMethod} disabled={methodDisabled}>
            <DeleteIcon />
            <Typography sx={styles.menuItemText}>Delete</Typography>
          </MenuItem>
        </Menu>
        <ResourceMenu
          anchor={anchor}
          openMenu={resourceMenu}
          handleClose={handleCloseResourceMenu}
        />
      </Grid>
      <CardActions>
        <Fab size={"small"} onClick={handleResourceMenu}>
          <AddIcon />
        </Fab>
      </CardActions>
    </Card>
  );
}

export const graph = (api) => {
  const list = Object.keys(api).map((key) => ({
    path: key,
    methods: Object.keys(api[key]),
  }));

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

  return graph;
};

export const compile = (
  list,
  handleContextMenu,
  expandList,
  rightClickMethod
) =>
  list.map((api) => {
    let children = undefined;
    let resourceHash;

    if (api.resources && api.resources.length > 0) {
      children = compile(
        api.resources,
        handleContextMenu,
        expandList,
        rightClickMethod
      );
    }

    children = api.methods
      .map((method) => {
        const payload = { path: api.path, method };
        const hash = (resourceHash = window.btoa(JSON.stringify(payload)));
        map[hash] = payload;

        return (
          <TreeItem
            key={hash}
            nodeId={hash}
            onContextMenu={(event) => handleContextMenu(event, hash)}
            sx={{
              bgcolor:
                hash === rightClickMethod &&
                theme.palette.custom.apiTreeRightClick,
            }}
            label={
              <Box sx={styles.apiTreeItem}>
                <center>{method.toUpperCase()}</center>
              </Box>
            }
          />
        );
      })
      .concat(children);
    expandList.push(api.path);

    return (
      <NonExpandableAPITreeItem
        key={api.path}
        nodeId={api.path}
        label={api.label}
        children={children}
        onClick={() => {
          return { hash: resourceHash, map: map };
        }}
      />
    );
  });

export default APITree;
