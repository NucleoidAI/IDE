import AddList from "../../components/AddList";
import Arrow from "../../icons/Arrow";
import BlankTreeMessage from "../../components/BlankTreeMessage/BlankTreeMessage";
import Error from "@mui/icons-material/Error";
import Fade from "@mui/material/Fade";
import FolderIcon from "@mui/icons-material/FolderRounded";
import NonExpandableFunctionTreeItem from "../../components/NonExpandableFunctionTreeItem";
import actions from "../../actions";
import styles from "./styles";
import { useContext } from "../../context/context";
import { useEvent } from "@nucleoidai/react-event";

import {
  Box,
  Card,
  CardActions,
  Grid,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { TreeItem, TreeView } from "@mui/lab";

function FunctionTree({ openFunctionDialog }) {
  const [selected, setSelected] = React.useState(null);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [hoveredNodeId, setHoveredNodeId] = React.useState(null);
  const [state, dispatch] = useContext();
  const functions = state.get("nucleoid.functions");
  //eslint-disable-next-line
  const [functionExist, setFunctionExist] = React.useState(
    Boolean(functions.length)
  );
  const graph = { "": { name: "", subs: [], path: "", functions: [] } };
  const [errors] = useEvent("DIAGNOSTICS_COMPLETED", []);

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
      select(functions[0]?.path);
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

    const { params, type, builtin } = functions.find(
      (item) => item.path === each.path
    );
    graph[path].functions.push({ name, params, type, builtin });
  }

  const deleteFunction = () => {
    dispatch({
      type: "DELETE_FUNCTION",
      payload: { path: selected },
    });
    handleClose();
  };

  return (
    <Card sx={{ width: "100%", height: "100%" }}>
      {functionExist ? (
        <>
          <TreeView
            defaultCollapseIcon={<Arrow down />}
            defaultExpandIcon={<Arrow right />}
            defaultExpanded={["/", "/classes/"]}
            onNodeSelect={(event, value) => select(value)}
            selected={selected}
            sx={{
              marginTop: "10px",
            }}
          >
            {compile(
              [graph[""]],
              handleContextMenu,
              errors,
              hoveredNodeId,
              setHoveredNodeId,
              selected
            )}
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
          <CardActions>
            <AddList
              clickEvent={openFunctionDialog}
              list={["Class", "Function"]}
            />
          </CardActions>
        </>
      ) : (
        <BlankTreeMessage item={"Function"} />
      )}
    </Card>
  );
}

const compile = (
  folders,
  handleContextMenu,
  errors,
  hoveredNodeId,
  setHoveredNodeId,
  selected
) =>
  folders.map((folder) => {
    let children = [];

    if (folder.subs && folder.subs.length > 0) {
      children = compile(
        folder.subs,
        handleContextMenu,
        errors,
        hoveredNodeId,
        setHoveredNodeId,
        selected
      );
    }

    children = children.concat(
      folder.functions
        .filter((each) => !each?.builtin)
        .map((fn) => {
          const error = errors.find((item) => {
            const [errName] = item.file.fileName.split(".");
            if (errName.includes(fn.name)) {
              return item;
            } else {
              return null;
            }
          });

          const nodeId = `${root(folder.path)}${fn.name}`;
          const isHovered = hoveredNodeId === nodeId;
          const isSelected = selected === nodeId;

          return (
            <TreeItem
              key={nodeId}
              nodeId={nodeId}
              onContextMenu={(event) => handleContextMenu(event, nodeId)}
              onMouseEnter={() => setHoveredNodeId(nodeId)}
              onMouseLeave={() => setHoveredNodeId(null)}
              label={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid sx={styles.treeItem}>
                    <Typography style={{ font: "9px sans-serif" }}>
                      {fn.type === "FUNCTION" ? (
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;fn</span>
                      ) : (
                        "class"
                      )}
                    </Typography>
                    &nbsp;
                    {`${fn.name}`}
                    <Typography
                      style={{
                        font: "9px sans-serif",
                        marginLeft: "4px",
                        opacity: isHovered || isSelected ? 1 : 0,
                        transition: "opacity 0.5s ease-in-out",
                      }}
                    >
                      {fn.type === "FUNCTION"
                        ? ""
                        : `(${fn.params.join(", ")})`}
                    </Typography>
                  </Grid>
                  {error && (
                    <Tooltip title={error.messageText} placement={"right"}>
                      <Error sx={{ color: "#8f8f91" }} />
                    </Tooltip>
                  )}
                </Box>
              }
            />
          );
        })
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
