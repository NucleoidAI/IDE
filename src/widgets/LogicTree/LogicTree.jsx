import { AutoAwesome } from "@mui/icons-material";
import BlankTreeMessage from "../../components/BlankTreeMessage/BlankTreeMessage";
import { useContext } from "../../context/context";
import { useTheme } from "@mui/material/styles";

import { Box, Card, CardActions, Fab, Grid, Typography } from "@mui/material";
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { TreeItem, TreeView, treeItemClasses } from "@mui/lab";
import { alpha, styled } from "@mui/material/styles";
import { publish, useEvent } from "@nucleoidai/react-event";

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    paddingY: theme.spacing(0.5),
    paddingX: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  },
  [`& .${treeItemClasses.label}`]: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2),
    },
  },
}));

const styles = {
  treeItem: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  classIndicator: {
    marginRight: "4px",
    color: "#c3c5c8",
  },
};

function LogicTree({ openLogicDialog }) {
  const [newDeclaration] = useEvent("LOGIC_ADDED", false);
  const [state, dispatch] = useContext();
  const [treeData, setTreeData] = React.useState({});
  const [selectedKey, setSelectedKey] = useState([]);
  const [nodeKey, setNodeKey] = useState([]);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const theme = useTheme();

  const declarations = state.nucleoid.declarations;
  const functions = state.nucleoid.functions;
  //eslint-disable-next-line
  const [logicExist, setLogicExist] = useState(Boolean(declarations.length));

  function select(value) {
    const [logicClass, logicIndex] = value.split("-");

    if (logicIndex === undefined) {
      setNodeKey((oldNodeKey) => {
        if (oldNodeKey.includes(logicClass)) {
          return oldNodeKey.filter((item) => item !== logicClass);
        } else {
          return [...oldNodeKey, logicClass];
        }
      });
      return;
    }

    setSelectedKey([logicClass]);
    const selectedSummary = treeData[logicClass].summaries[logicIndex];
    const item = declarations.find((item) => item.summary === selectedSummary);

    if (item) {
      dispatch({
        type: "SET_SELECTED_LOGIC",
        payload: { logic: item },
      });
    }
  }

  useEffect(() => {
    const treeData = {};
    const initialExpandedNodes = [];
    console.log(declarations);
    if (declarations.length !== 0) {
      declarations.forEach((dec) => {
        const decSummary = dec.summary;
        const decClass = dec?.definition?.split("$")[1]?.match(/\b(\w+)\b/)[0];

        if (!treeData[decClass]) {
          treeData[decClass] = {
            summaries: [],
            params: [],
          };
          initialExpandedNodes.push(decClass);
        }

        treeData[decClass].summaries.push(decSummary);

        const matchingFunction = functions.find(
          (func) => func.path === `/${decClass}`
        );
        if (matchingFunction) {
          treeData[decClass].params = matchingFunction.params;
        }
      });
    }

    setTreeData(treeData);
    setNodeKey(initialExpandedNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (newDeclaration) {
      const declarationSummary = newDeclaration.declaration.summary;
      const declarationClass = newDeclaration.declaration?.definition
        ?.split("$")[1]
        ?.match(/\b(\w+)\b/)[0];

      setTreeData((prevTreeData) => {
        const newTreeData = { ...prevTreeData };

        if (!newTreeData[declarationClass]) {
          newTreeData[declarationClass] = [];
        }
        newTreeData[declarationClass].push(declarationSummary);

        return newTreeData;
      });

      select(`${declarationClass}-${treeData[declarationClass]?.length}`);
    }
    publish("LOGIC_ADDED", false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDeclaration]);

  return (
    <Card sx={{ width: "100%", height: "100%" }}>
      {logicExist ? (
        <>
          <TreeView
            aria-label="controlled"
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              ".MuiTreeItem-root": {
                alignItems: "center",
              },
              ".MuiTreeItem-content": {
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 8px",
                borderRadius: "4px",
                margin: "2px 0",
              },
              ".MuiTreeItem-label": {
                width: "100%",
                display: "flex",
                alignItems: "center",
              },
              ".MuiTreeItem-group": {
                marginLeft: "16px !important",
                paddingLeft: "8px",
                borderLeft: `1px solid ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
              },
              ".MuiTreeItem-iconContainer": {
                minWidth: "0",
                marginRight: "0px",
                padding: "0px",
              },
            }}
            onNodeSelect={(event, value) => select(value)}
            expanded={nodeKey}
            selected={selectedKey}
          >
            {Object.entries(treeData).map(([nodeId, { summaries, params }]) => (
              <StyledTreeItem
                key={nodeId}
                nodeId={nodeId}
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
                        class
                      </Typography>
                      &nbsp;
                      {nodeId}
                      <Typography
                        style={{
                          font: "9px sans-serif",
                          marginLeft: "4px",
                          opacity:
                            hoveredNodeId === nodeId ||
                            selectedKey.includes(nodeId)
                              ? 1
                              : 0,
                          transition: "opacity 0.5s ease-in-out",
                        }}
                      >
                        {`(${params.join(", ")})`}
                      </Typography>
                    </Grid>
                  </Box>
                }
              >
                {summaries.map((summary, innerIndex) => {
                  const formattedLabel =
                    summary.length > 30
                      ? `${summary.substring(0, 30)}..`
                      : summary;

                  return (
                    <StyledTreeItem
                      key={innerIndex}
                      nodeId={`${nodeId}-${innerIndex}`}
                      label={<>{formattedLabel}</>}
                      title={summary}
                    />
                  );
                })}
              </StyledTreeItem>
            ))}
          </TreeView>

          <CardActions>
            <Fab size="medium" onClick={openLogicDialog}>
              <AutoAwesome />
            </Fab>
          </CardActions>
        </>
      ) : (
        <BlankTreeMessage item={"Logic"} />
      )}
    </Card>
  );
}

export default LogicTree;
