import Arrow from "../../icons/Arrow";
import Fade from "@mui/material/Fade";
import FolderIcon from "@mui/icons-material/FolderRounded";
import NonExpandableFunctionTreeItem from "../../components/NonExpandableFunctionTreeItem";
import actions from "../../actions";
import styles from "./styles";
import { useContext } from "../../Context/context";
import { Grid, Menu, MenuItem, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { TreeItem, TreeView } from "@mui/lab";

function FunctionTree() {
  const [selected, setSelected] = React.useState(null);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [state, dispatch] = useContext();
  const functions = state.get("nucleoid.functions");
  const graph = { "": { name: "", subs: [], path: "", functions: [] } };

  const select = (value) => {
    if (functions.find((item) => item.path === value)) {
      setSelected(value);
      dispatch({
        type: actions.setSelectedFunction,
        payload: { function: value },
      });
    }
  };

  const handleContextMenu = (event, id) => {
    event.preventDefault();

    if (id) select(id);
    setContextMenu(
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
  };

  useEffect(() => {
    if (!selected) {
      select(functions[0].path);
    }
    //eslint-disable-next-line
  }, []);

  const list = functions;

  for (let i = 0; i < list.length; i++) {
    const each = list[i];

    const parts = each.path.substring(1).split("/");
    const name = parts.pop();
    const path = parts.join("/");
    const folder = parts.pop() || "";
    const parent = parts.join("/");

    if (!graph[path]) {
      graph[folder] = {
        name: folder,
        subs: [],
        path,
        functions: [],
      };

      if (graph[parent]) {
        graph[parent].subs.push(graph[path]);
      }
    }

    const { params, type } = functions.find((item) => item.path === each.path);
    graph[path].functions.push({ name, params, type });
  }

  const deleteFunction = (e) => {
    dispatch({
      type: "DELETE_FUNCTION",
      payload: { path: selected },
    });
    handleClose();
  };

  return (
    <>
      <TreeView
        defaultCollapseIcon={<Arrow down />}
        defaultExpandIcon={<Arrow right />}
        defaultExpanded={["/", "/classes/"]}
        onNodeSelect={(event, value) => select(value)}
        selected={selected}
      >
        {compile([graph[""]], handleContextMenu)}
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
        <MenuItem onClick={deleteFunction}>Delete</MenuItem>
      </Menu>
    </>
  );
}

const compile = (folders, handleContextMenu) =>
  folders.map((folder) => {
    let children = [];

    if (folder.subs && folder.subs.length > 0) {
      children = compile(folder.subs, handleContextMenu);
    }

    children = children.concat(
      folder.functions.map((fn) => (
        <TreeItem
          key={`${root(folder.path)}${fn.name}`}
          nodeId={`${root(folder.path)}${fn.name}`}
          onContextMenu={(event) =>
            handleContextMenu(event, `${root(folder.path)}${fn.name}`)
          }
          label={
            <Grid sx={styles.treeItem}>
              <Typography style={{ font: "9px sans-serif" }}>
                {fn.type === "FUNCTION" ? (
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;fn</span>
                ) : (
                  "class"
                )}
              </Typography>
              &nbsp;
              {`${fn.name} (${fn.params.join(", ")})`}
            </Grid>
          }
        />
      ))
    );

    return (
      <NonExpandableFunctionTreeItem
        key={root(folder.path)}
        nodeId={root(folder.path)}
        onClick={(event) => {
          event.preventDefault();
        }}
        label={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <FolderIcon style={{ color: "#c3c5c8" }} />
            &nbsp;
            {folder.name}
          </div>
        }
        children={children}
      />
    );
  });

const root = (path) => {
  const tmp = path.charAt(0) === "/" ? "" : "/" + path;
  return tmp + (tmp.substr(-1) === "/" ? "" : "/");
};

export default FunctionTree;
