import { AutoAwesome } from "@mui/icons-material";
import LensBlurIcon from "@mui/icons-material/LensBlur";
import { useContext } from "../../context/context";
import { useTheme } from "@mui/material/styles";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fab,
} from "@mui/material";
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { TreeItem, TreeView, treeItemClasses } from "@mui/lab";
import { alpha, styled } from "@mui/material/styles";
import { publish, useEvent } from "@nucleoidjs/react-event";

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

const GreenIcon = styled(Box)(({ theme, selected }) => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  backgroundColor: selected
    ? theme.palette.success.main
    : theme.palette.grey[400],
  marginRight: theme.spacing(1),
  transition: "background-color 0.2s",
}));

function LogicTree({ openLogicDialog }) {
  const [newDeclaration] = useEvent("LOGIC_ADDED", false);
  const [state, dispatch] = useContext();
  const [treeData, setTreeData] = React.useState({});
  const [selectedKey, setSelectedKey] = useState([]);
  const [nodeKey, setNodeKey] = useState([]);

  const theme = useTheme();

  const declarations = state.nucleoid.declarations;

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
              borderLeft: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
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
          {Object.entries(treeData).map(([nodeId, labels]) => (
            <StyledTreeItem key={nodeId} nodeId={nodeId} label={nodeId}>
              {labels.map((label, innerIndex) => {
                const formattedLabel =
                  label.length > 30 ? `${label.substring(0, 30)}..` : label;
                const isSelected = selectedKey.includes(
                  `${nodeId}-${innerIndex}`
                );
                return (
                  <StyledTreeItem
                    key={innerIndex}
                    nodeId={`${nodeId}-${innerIndex}`}
                    label={
                      <>
                        <GreenIcon selected={isSelected} />
                        {formattedLabel}
                      </>
                    }
                    title={label}
                  />
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
