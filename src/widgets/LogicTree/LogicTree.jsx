import AddIcon from "@mui/icons-material/Add";
import HubIcon from "@mui/icons-material/Hub";
import LogicTreeItem from "./LogicTreeItem";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { alpha } from "@mui/material/styles";
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
import { publish, useEvent } from "@nucleoidjs/react-event";

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
    const logicClass = value.split("-")[0];
    const logicIndex = value.split("-")[1];

    if (logicIndex === undefined) {
      setNodeKey((oldNodeKey) => {
        if (oldNodeKey.includes(logicClass)) {
          return oldNodeKey.filter((item) => item !== logicClass);
        } else {
          return [...oldNodeKey, `${logicClass}`];
        }
      });
      return;
    }

    const index = findIndexInObject(logicClass);
    setNodeKey([`${index}`]);

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

    declarations.map((dec) => {
      const decSummary = dec.summary;
      const decClass = dec?.definition?.split("$")[1]?.match(/\b(\w+)\b/)[0];
      if (!treeData[decClass]) {
        treeData[decClass] = [];
      }

      treeData[decClass].push(decSummary);
    });

    setTreeData(treeData);
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
  }, [newDeclaration]);

  return (
    <>
      <Card sx={{ width: "100%", height: "100%" }}>
        <CardHeader avatar={<HubIcon sx={{ color: "#c3c5c8" }} />} />

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
              <LogicTreeItem
                key={nodeId}
                nodeId={index.toString()}
                label={nodeId}
              >
                {labels.map((label, index) => (
                  <Stack key={index} direction="row" sx={{ width: 1 }}>
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
                        borderColor: alpha("#209958", 0.5),
                      }}
                    ></Box>
                    <LogicTreeItem
                      key={index}
                      nodeId={`${nodeId}-${index}`}
                      label={label}
                    />
                  </Stack>
                ))}
              </LogicTreeItem>
            ))}
          </TreeView>
        </CardContent>
        <CardActions>
          <Fab size="small" onClick={openLogicDialog}>
            <AddIcon />
          </Fab>
        </CardActions>
      </Card>
    </>
  );
}

export default LogicTree;
