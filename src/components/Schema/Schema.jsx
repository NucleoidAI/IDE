import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { v4 as uuidv4 } from "uuid";

import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TreeItem, TreeView } from "@mui/lab";

const Schema = ({ initialData = {}, customTypes = [] }) => {
  const [schemaData, setSchemaData] = useState({});

  useEffect(() => {
    const addIdsToSchema = (schema) => {
      if (!schema) return null;

      return {
        ...schema,
        id: uuidv4(),
        properties: schema.properties?.map(addIdsToSchema),
      };
    };

    if (Object.keys(initialData).length === 0) {
      setSchemaData({
        type: "object",
        properties: [],
      });
    } else {
      setSchemaData(addIdsToSchema(initialData));
    }
  }, [initialData]);

  const renderTree = (node, level = 0) => (
    <TreeItem
      key={node.id}
      nodeId={level === 0 ? "1" : node.id}
      label={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1px",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                gap: "4px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    padding: "2px 2px",
                    borderRadius: "4px",
                  }}
                >
                  {node.name}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  {node.type}
                </Typography>
              </Box>
            </Box>
          </div>
        </div>
      }
    >
      {Array.isArray(node.properties)
        ? node.properties.map((childNode) => renderTree(childNode, level + 1))
        : isCustomType(node.type)
        ? renderCustomTypeNode(node)
        : null}
    </TreeItem>
  );

  const isCustomType = (type) => {
    return customTypes.some((customType) => customType.name === type);
  };

  const renderCustomTypeNode = (node) => {
    const customTypeSchema = customTypes.find(
      (type) => type.name === node.type
    )?.schema;

    if (!customTypeSchema || !customTypeSchema.properties) {
      return <Box sx={{ paddingLeft: "20px" }}>No properties defined</Box>;
    }

    return (
      <Box sx={{ paddingLeft: "20px" }}>
        {customTypeSchema.properties.map((prop, index) => (
          <Box
            key={index}
            sx={{
              paddingTop: "5px",
              paddingBottom: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: (theme) => theme.palette.grey[600],
              }}
            >
              {prop.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginLeft: "8px",
                color: (theme) => theme.palette.grey[500],
              }}
            >
              {prop.type}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={["1"]}
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        width: "100%",
        ".MuiTreeItem-root": {
          alignItems: "center",
        },
        ".MuiTreeItem-content": {
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: "1px 8px",
          borderRadius: "4px",
          margin: "1px 0",
          transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
        },
        ".MuiTreeItem-label": {
          width: "100%",
          fontWeight: "bold",
        },
        ".MuiTreeItem-group": {
          marginLeft: "16px !important",
          paddingLeft: "8px",
          borderLeft: `1px solid`,
          borderColor: (theme) => theme.palette.grey[400],
        },
        ".MuiTreeItem-iconContainer": {
          minWidth: "0",
          marginRight: "0px",
          padding: "0px",
        },
      }}
    >
      {renderTree(schemaData, 0)}
    </TreeView>
  );
};

export default Schema;
