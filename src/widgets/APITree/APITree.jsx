import AddIcon from "@mui/icons-material/Add";
import ArrowIcon from "../../icons/Arrow";
import BlankTreeMessage from "../../components/BlankTreeMessage/BlankTreeMessage";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteMethodDialog from "../../components/DeleteMethodDialog";
import EditIcon from "@mui/icons-material/Edit";
import Error from "@mui/icons-material/Error";
import Fade from "@mui/material/Fade";
import ResourceMenu from "../ResourceMenu";
import styles from "./styles";
import { useContext } from "../../context/context";
import { useEvent } from "@nucleoidai/react-event";
import { useTheme } from "@mui/material/styles";

import {
  Box,
  Card,
  CardActions,
  Fab,
  Grid,
  Menu,
  MenuItem,
  Tooltip,
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
  const [errors] = useEvent("DIAGNOSTICS_COMPLETED", []);
  const [state, dispatch] = useContext();
  const theme = useTheme();

  const [selectedAPI] = useEvent("SELECTED_API_CHANGED", {
    path: "/",
    method: "GET",
  });

  const api = state.get("specification.api");
  //eslint-disable-next-line
  const [apiExists, setApiExists] = useState(Boolean(api.length));

  const expandList = React.useMemo(() => [], []);

  const handleToggle = (event, ids) => {
    setExpanded(ids);
  };

  const handleExpandClick = () => {
    setExpanded([...expandList]);
  };

  const select = (id, callDispatch = true) => {
    if (map[id]) {
      setSelected(id);
      if (callDispatch) {
        dispatch({ type: "SET_SELECTED_API", payload: map[id] });
      }
    }
  };

  useEffect(() => {
    const selectedId = Object.keys(map).find(
      (key) =>
        map[key].path === selectedAPI.path &&
        map[key].method === selectedAPI.method
    );
    if (selectedId) {
      select(selectedId, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAPI]);

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
    const { pages, specification } = state;
    const { api } = specification;

    const countMethodsForPath = (path) => {
      return api.filter((endpoint) => endpoint.path === path).length;
    };
    if (pages.api.selected) {
      const apiSelectedPath = pages.api.selected.path;

      return countMethodsForPath(apiSelectedPath) <= 1;
    }
    return false;
  };

  useEffect(() => {
    if (!selected) {
      select(Object.keys(map)[0]);
    }
    setMethodDisabled(checkMethodDeletable());
    handleExpandClick();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, state]);

  return (
    <Card sx={{ height: "100%" }}>
      {apiExists ? (
        <>
          <Grid sx={styles.apiTreeGrid}>
            {open && (
              <DeleteMethodDialog
                setOpen={setOpen}
                deleteMethod={deleteMethod}
              />
            )}
            <TreeView
              defaultCollapseIcon={<ArrowIcon down />}
              defaultExpandIcon={<ArrowIcon right />}
              onNodeToggle={handleToggle}
              expanded={expanded}
              onNodeSelect={(event, value) => select(value)}
              selected={selected}
              sx={{
                marginTop: "10px",
              }}
            >
              {compile(
                api,
                handleContextMenu,
                expandList,
                rightClickMethod,
                errors,
                theme,
                select,
                handleResourceMenu
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
                data-cy="edit-method-menu-item"
              >
                <EditIcon />
                <Typography sx={styles.menuItemText}>Edit</Typography>
              </MenuItem>
              <MenuItem
                onClick={handleDeleteMethod}
                disabled={methodDisabled}
                data-cy="delete-method-button"
              >
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
            <Fab
              variant="button"
              size={"small"}
              onClick={handleResourceMenu}
              data-cy="resource-menu"
            >
              <AddIcon />
            </Fab>
          </CardActions>
        </>
      ) : (
        <BlankTreeMessage item={"API"} />
      )}
    </Card>
  );
}

export const compile = (
  apiData,
  handleContextMenu,
  expandList,
  rightClickMethod,
  errors,
  theme,
  select,
  handleResourceMenu
) => {
  if (apiData.length !== 0) {
    const groupedByPath = apiData.reduce((acc, endpoint) => {
      const parts = endpoint.path.split("/");
      let currentLevel = acc;

      if (endpoint.path === "/") {
        if (!currentLevel["/"]) {
          currentLevel["/"] = {
            methods: [],
            children: {},
          };
        }
        currentLevel["/"].methods.push(endpoint);
      } else {
        currentLevel = currentLevel["/"].children;

        parts.forEach((part, idx, arr) => {
          if (idx !== 0) {
            const currentPart = "/" + part;

            if (!currentLevel[currentPart]) {
              currentLevel[currentPart] = {
                methods: [],
                children: {},
              };
            }

            if (idx === arr.length - 1) {
              currentLevel[currentPart].methods.push(endpoint);
            } else {
              currentLevel = currentLevel[currentPart].children;
            }
          }
        });
      }

      return acc;
    }, {});

    const renderTree = (data) => {
      // eslint-disable-next-line
      let resourceHash;
      // eslint-disable-next-line

      return Object.keys(data).map((path) => {
        const { methods, children } = data[path];

        const methodItems = methods.map((method) => {
          const payload = { path: method.path, method: method.method };
          const hash = (resourceHash = window.btoa(JSON.stringify(payload)));
          map[hash] = payload;

          const error = errors.find((item) => {
            const [errPath, errMethod] = item.file.fileName.split(".", 2);
            if (errPath === method.path && errMethod === method.method) {
              return item;
            } else {
              return null;
            }
          });

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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  data-cy={`method-${method.path}${method.method}`}
                >
                  <Box sx={theme.custom.apiTreeItem}>
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {method.method.toUpperCase()}
                    </span>
                  </Box>
                  {error && (
                    <Tooltip title={error.messageText} placement={"right"}>
                      <Error sx={{ color: "#8f8f91" }} />
                    </Tooltip>
                  )}
                </Box>
              }
            />
          );
        });

        const childItems = children ? renderTree(children) : [];
        expandList.push(path);

        const handleResourceClick = (event) => {
          event.stopPropagation();

          if (methods.length > 0) {
            const firstMethod = methods[0];
            const payload = {
              path: firstMethod.path,
              method: firstMethod.method,
            };
            const hash = window.btoa(JSON.stringify(payload));
            select(hash);
          }
        };

        const handleResourceContextMenu = (event) => {
          event.preventDefault();
          handleResourceClick(event);
          handleResourceMenu(event);
        };

        return (
          <TreeItem
            key={path}
            nodeId={path}
            label={
              <div
                className="path"
                onClick={(e) => e.stopPropagation()}
                onContextMenu={handleResourceContextMenu}
                style={{ cursor: "default" }}
                data-cy={`path-${path}`}
              >
                {path}
              </div>
            }
            children={[...methodItems, ...childItems]}
            collapseIcon={<ArrowIcon down />}
            expandIcon={<ArrowIcon right />}
          />
        );
      });
    };

    return renderTree(groupedByPath);
  } else {
    return null;
  }
};

export default APITree;
