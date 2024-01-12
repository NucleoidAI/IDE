import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SchemaPropertyEditor from "./SchemaPropertyEditor";
import { v4 as uuidv4 } from "uuid";

import { Box, Typography } from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import { TreeItem, TreeView } from "@mui/lab";
import { addProperty, changeProperty, removeProperty } from "./SchemaUtils";

const SchemaEditor = forwardRef(
  ({ initialData = {}, customTypes = [] }, ref) => {
    const [schemaData, setSchemaData] = useState({});

    useEffect(() => {
      const addIdsToSchema = (schema) => {
        return {
          ...schema,
          id: uuidv4(),
          properties: schema.properties?.map(addIdsToSchema),
        };
      };

      if (!schemaData || Object.keys(schemaData).length === 0) {
        if (Object.keys(initialData).length === 0) {
          setSchemaData({
            type: "object",
            properties: [],
          });
        } else {
          const dataWithIds = addIdsToSchema(initialData);
          setSchemaData(dataWithIds);
        }
      }
    }, [initialData, schemaData]);

    const handleAddProperty = (newProperty, parentId = null) => {
      addProperty(parentId, setSchemaData);
    };

    const handleRemoveProperty = (propertyId) => {
      removeProperty(propertyId, setSchemaData);
    };

    const handleChangeProperty = (propertyId, changes) => {
      changeProperty(propertyId, changes, setSchemaData);
    };

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
              <SchemaPropertyEditor
                node={node}
                disableNameChange={level === 0}
                onNameChange={(newName) => {
                  handleChangeProperty(node.id, {
                    name: newName,
                    type: node.type,
                  });
                }}
                onTypeChange={(newType) => {
                  handleChangeProperty(level === 0 ? "1" : node.id, {
                    name: node.name,
                    type: newType,
                  });
                }}
                customTypes={customTypes}
              />
              {true && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddProperty(
                      { type: "string", name: "newProperty" },
                      level === 0 ? null : node.id
                    );
                  }}
                  disabled={
                    node.type !== "object" ||
                    (node.type === "array" && node.properties.length >= 1)
                  }
                  sx={{
                    color: (theme) => theme.palette.grey[600],
                    marginRight: "-8px ",
                  }}
                >
                  <AddCircleOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </div>

            {true && (
              <IconButton
                size="small"
                style={{ marginLeft: "auto" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveProperty(node.id);
                }}
                disabled={level === 0}
                sx={{
                  color: (theme) => theme.palette.grey[600],
                }}
              >
                <RemoveCircleOutlineIcon fontSize="small" />
              </IconButton>
            )}
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

    const schemaOutput = () => {
      const removeIds = (node) => {
        // eslint-disable-next-line no-unused-vars
        const { id, properties, ...rest } = node;
        if ((node.type === "object" || node.type === "array") && properties) {
          return { ...rest, properties: properties.map(removeIds) };
        }
        return rest;
      };

      return removeIds(schemaData);
    };

    React.useImperativeHandle(ref, () => ({
      schemaOutput: schemaOutput,
    }));

    const schemaOutputWithIDs = () => schemaData;

    SchemaEditor.addProperty = handleAddProperty;
    SchemaEditor.schemaOutput = schemaOutput;
    SchemaEditor.schemaOutputWithIDs = schemaOutputWithIDs;
    SchemaEditor.removeProperty = handleRemoveProperty;
    SchemaEditor.changeProperty = handleChangeProperty;
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
  }
);

export default SchemaEditor;
