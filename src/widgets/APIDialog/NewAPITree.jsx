import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import React, { useState } from "react";
import { TreeItem, TreeView } from "@mui/lab";

const NewAPITree = ({ apiData }) => {
  const [selectedType, setSelectedType] = useState(
    apiData.length > 0 ? apiData[0].name : null
  );
  const [expanded, setExpanded] = useState(apiData.map((item) => item.name));
  const preloaded = {};
  apiData.forEach((item) => {
    preloaded[item.name] = true;
  });
  const [loaded, setLoaded] = useState(preloaded);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
    nodeIds.forEach((nodeId) => {
      if (!loaded[nodeId]) {
        setLoaded({ ...loaded, [nodeId]: true });
      }
    });
  };

  const handleTypeSelect = (name) => {
    setSelectedType(name);
  };

  const renderTree = (node, isRef = false, parentPath = "") => {
    let label;
    let childNodes = [];

    if (isRef) {
      const refSchema = findSchemaByName(node.ref);
      if (refSchema) {
        childNodes = refSchema.properties;
        label = `${refSchema.name} (ref)`;
      } else {
        label = `${node.name} (ref - not found)`;
      }
    } else {
      switch (node.type) {
        case "string":
        case "number":
          label = `${node.name} (${node.type})`;
          break;
        case "object":
        case "array":
          label = `${node.name} (${node.type})`;
          childNodes = node.properties;
          break;
        default:
          label = node.name;
      }
    }
    const nodeId = parentPath ? `${parentPath}.${node.name}` : node.name;
    const isLoaded = loaded[nodeId];
    const isPrimitive = node.type === "string" || node.type === "number";

    return (
      <TreeItem key={nodeId} nodeId={nodeId} label={label}>
        {isLoaded && !isPrimitive
          ? childNodes.map((childNode) =>
              childNode.type === "ref"
                ? renderTree(childNode, true, nodeId)
                : renderTree(childNode, false, nodeId)
            )
          : !isPrimitive && (
              <TreeItem nodeId="placeholder" label="Loading..." />
            )}
      </TreeItem>
    );
  };

  return (
    <Box display="flex" height="100%" sx={{ p: 2, m: 1 }}>
      <List
        component="nav"
        sx={{
          width: "50%",
          bgcolor: "background.paper",
          borderRadius: 1,
          overflow: "auto",
        }}
      >
        {apiData.map((item) => (
          <ListItemButton
            selected={selectedType === item.name}
            onClick={() => handleTypeSelect(item.name)}
            key={item.name}
          >
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>

      <Box
        sx={{
          width: "50%",
          bgcolor: "background.paper",
          borderRadius: 1,
          overflowY: "auto",
        }}
      >
        <TreeView
          aria-label="api data tree"
          expanded={expanded}
          onNodeToggle={handleToggle}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {selectedType && renderTree(findSchemaByName(selectedType))}
        </TreeView>
      </Box>
    </Box>
  );

  function findSchemaByName(name) {
    const schema = apiData.find((schema) => schema.name === name);
    return schema ? schema.schema : null;
  }
};

export default NewAPITree;
