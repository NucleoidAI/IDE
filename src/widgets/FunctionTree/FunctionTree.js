import Arrow from "../../icons/Arrow";
import Fade from "@mui/material/Fade";
import FolderIcon from "@mui/icons-material/FolderRounded";
import NonExpandableFunctionTreeItem from "../../components/NonExpandableFunctionTreeItem";
import actions from "../../actions";
import styles from "./styles";
import { useContext } from "../../Context/providers/contextProvider";
import { Grid, Menu, MenuItem, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { TreeItem, TreeView } from "@mui/lab";

function FunctionTree() {
  const [selected, setSelected] = React.useState(null);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [state, dispatch] = useContext();
  const functions = state.get("nucleoid.functions");

  const generateGraph = (data) => {
    const base = { label: "/", children: [] };

    for (const node of data) {
      const path = node.path.match(/\/[^\/]+/g);
      let curr = base;

      path.forEach((e, i) => {
        const currPath = path.slice(0, i + 1).join("");
        const child = curr.children.find((e) => e.path === currPath);

        if (child) {
          curr = child;
        } else {
          let others;
          if (node.path.split("/").pop() === currPath.split("/").pop()) {
            //others = { ...node };
          } else {
            others = {
              expanded: true,
            };
          }
          curr.children.push({
            label: "/" + currPath.split("/").pop(),
            path: currPath,
            children: [],
            ...others,
          });
          curr = curr.children[curr.children.length - 1];
        }
      });
    }

    return base;
  };

  const graph = generateGraph(functions);
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
    generateGraph();
    if (!selected) {
      select(functions[0].path);
    }
    //eslint-disable-next-line
  }, []);

  console.log(graph);

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
        <MenuItem onClick={handleClose}>Move</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
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
