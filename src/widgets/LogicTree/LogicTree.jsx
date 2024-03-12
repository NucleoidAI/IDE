import { AutoAwesome } from "@mui/icons-material";
import LensBlurIcon from "@mui/icons-material/LensBlur";
import { useContext } from "../../context/context";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fab,
  Stack,
} from "@mui/material";
import { CloseSquare, MinusSquare, PlusSquare } from "./TreeIcons/TreeIcons";
import React, { useEffect, useState } from "react";
import { TreeItem, TreeView, treeItemClasses } from "@mui/lab";
import { alpha, styled } from "@mui/material/styles";
import { publish, useEvent } from "@nucleoidjs/react-event";

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    margin: 2,
    height: 40,
    width: "100%",
  },
  [`& .${treeItemClasses.label}`]: {
    width: "100%",
  },
  [`& .${treeItemClasses.expanded}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.3),
    borderRadius: theme.shape.borderRadius,
  },
  [`& .${treeItemClasses.focused}`]: {
    borderRadius: theme.shape.borderRadius,
  },
  [`& .${treeItemClasses.selected}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderRight: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

function LogicTree({ openLogicDialog }) {
  const [newDeclaration] = useEvent("LOGIC_ADDED", false);
  const [state, dispatch] = useContext();
  const [treeData, setTreeData] = React.useState({});
  const [selectedKey, setSelectedKey] = useState([]);
  const [nodeKey, setNodeKey] = useState([]);

  const declarations = state.nucleoid.declarations;

  function findIndexInObject(key) {
    const keys = Object.keys(treeData);
    const index = keys.indexOf(key);
    return index;
  }

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

    const index = findIndexInObject(logicClass);
    setNodeKey([index.toString()]);

    setSelectedKey([`${logicClass}-${logicIndex}`]);

    const selectedSummary = treeData[logicClass][logicIndex];
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

    declarations.forEach((dec) => {
      const decSummary = dec.summary;
      const decClass = dec?.definition?.split("$")[1]?.match(/\b(\w+)\b/)[0];
      if (!treeData[decClass]) {
        treeData[decClass] = [];
        initialExpandedNodes.push(decClass);
      }

      treeData[decClass].push(decSummary);
    });

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
      <CardHeader avatar={<LensBlurIcon variant="pageIcon" />} />

      <CardContent sx={{ width: "100%", height: "100%" }}>
        <TreeView
          aria-label="controlled"
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={<CloseSquare />}
          sx={{ overflowX: "hidden" }}
          onNodeSelect={(event, value) => select(value)}
          expanded={nodeKey}
          selected={selectedKey}
        >
          {Object.entries(treeData).map(([nodeId, labels], index) => (
            <StyledTreeItem key={nodeId} nodeId={nodeId} label={nodeId}>
              {labels.map((label, innerIndex) => {
                const formattedLabel =
                  label.length > 30 ? `${label.substring(0, 30)}..` : label;
                return (
                  <Stack key={innerIndex} direction="row" sx={{ width: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        width: 1,
                        alignSelf: "center",
                        height: 10,
                        marginTop: -0.8,
                        marginLeft: -2.3,
                        marginRight: -2.3,
                        maxWidth: "6%",
                        borderWidth: "2px",
                        borderStyle: "none none solid none",
                        borderRadius: "30px 30px 30px 80px",
                        borderColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.5),
                      }}
                    />
                    <StyledTreeItem
                      key={innerIndex}
                      nodeId={`${nodeId}-${innerIndex}`}
                      label={formattedLabel}
                      title={label}
                    />
                  </Stack>
                );
              })}
            </StyledTreeItem>
          ))}
        </TreeView>
      </CardContent>
      <CardActions>
        <Fab size="medium" onClick={openLogicDialog}>
          <AutoAwesome />
        </Fab>
      </CardActions>
    </Card>
  );
}

export default LogicTree;
