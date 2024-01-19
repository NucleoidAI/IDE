import { Box, Divider, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { TreeItem, TreeView } from "@mui/lab";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Schema from "../Schema/Schema";
import SchemaEditor from "../SchemaEditor";

const APITypes = ({ tstypes, nuctypes, typesRef }) => {
  const combinedData = [
    ...tstypes.map((item) => ({ ...item, isTypeScript: true })),
    ...nuctypes.map((item) => ({ ...item, isTypeScript: false })),
  ];

  const [selectedType, setSelectedType] = useState(
    combinedData.length > 0 ? combinedData[0].name : null
  );
  const [expanded, setExpanded] = useState(
    combinedData.map((item) => item.name)
  );
  const preloaded = {};
  combinedData.forEach((item) => {
    preloaded[item.name] = true;
  });
  const [loaded, setLoaded] = useState(preloaded);

  const isTypeScriptType = (typeName) => {
    return tstypes.some((type) => type.name === typeName);
  };
  const renderRightPanel = () => {
    if (!selectedType) return null;

    const useSchemaEditor = !isTypeScriptType(selectedType);
    const initialData = findSchemaByName(selectedType);

    return (
      <Box sx={{ width: "100%", height: "100%" }}>
        {useSchemaEditor ? (
          <SchemaEditor
            key={selectedType}
            ref={typesRef}
            initialData={initialData}
          />
        ) : (
          <Schema initialData={initialData} />
        )}
      </Box>
    );
  };

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "85%",
        p: 2,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          {combinedData.map((item) => (
            <Box
              key={item.name}
              onClick={() => handleTypeSelect(item.name)}
              sx={{
                padding: "8px 16px",
                cursor: "pointer",
                bgcolor:
                  selectedType === item.name
                    ? "primary.light"
                    : "background.paper",
                "&:hover": {
                  bgcolor: "primary.light",
                },
                width: "100%",

                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body1" style={{ textAlign: "left" }}>
                {item.name}
              </Typography>
              {item.isTypeScript && (
                <span
                  style={{
                    marginRight: "4px",
                    color: "#808080",
                    fontWeight: "bold",
                  }}
                >
                  TS
                </span>
              )}
            </Box>
          ))}
        </Paper>
      </Box>
      <Divider orientation="vertical" flexItem sx={{ width: "1rem" }} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {renderRightPanel()}
        </Paper>
      </Box>
    </Box>
  );

  function findSchemaByName(name) {
    const schema = combinedData.find((schema) => schema.name === name);
    return schema ? schema.schema : null;
  }
};

export default APITypes;
