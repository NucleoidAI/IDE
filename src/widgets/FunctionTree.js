import Arrow from "../icons/Arrow";
import FolderIcon from "@material-ui/icons/FolderRounded";
import { useContext } from "../context";
import { Menu, MenuItem, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { TreeItem, TreeView } from "@material-ui/lab";

function FunctionTree() {
  const [selected, setSelected] = React.useState(null);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [state, dispatch] = useContext();
  const functions = state.get("nucleoid.functions");
  const graph = { "": { name: "", subs: [], path: "", functions: [] } };

  const select = (value) => {
    if (functions[value]) {
      setSelected(value);
      dispatch({ type: "SET_SELECTED_FUNCTION", payload: { function: value } });
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
      select(Object.keys(functions).shift());
    }
  });

  const list = Object.keys(functions);

  for (let i = 0; i < list.length; i++) {
    const each = list[i];
    const parts = each.substring(1).split("/");
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

    const { params, type } = functions[each];
    graph[path].functions.push({ name, params, type });
  }

  return (
    <>
      <TreeView
        defaultCollapseIcon={<Arrow down />}
        defaultExpandIcon={<Arrow right />}
        defaultExpanded={["/", "/users/", "/utils/"]}
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography style={{ font: "9px sans-serif" }}>
                {fn.type === "FUNCTION" ? (
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;fn</span>
                ) : (
                  "class"
                )}
              </Typography>
              &nbsp;
              {`${fn.name} (${fn.params.join(", ")})`}
            </div>
          }
        />
      ))
    );

    return (
      <TreeItem
        key={root(folder.path)}
        nodeId={root(folder.path)}
        onLabelClick={(event) => {
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
