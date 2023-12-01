import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Select from "@mui/material/Select";
import { sliderClasses } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import React, { useEffect, useState } from "react";
import { TreeItem, TreeView } from "@mui/lab";

const getTypeStyle = (type) => {
  return {
    fontWeight: "normal",
    color: getTypeColor(type),
    marginLeft: "auto",
  };
};

const getTypeColor = (type) => {
  switch (type) {
    case "object":
      return "red";
    case "string":
      return "green";
    case "integer":
      return "blue";

    default:
      return "black";
  }
};

const Schema = ({ initialData = {} }) => {
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
  const addProperty = (newProperty) => {
    setSchemaData((currentData) => {
      const updatedProperties = currentData.properties
        ? [...currentData.properties]
        : [];

      updatedProperties.push({ ...newProperty, id: uuidv4() });

      return {
        ...currentData,
        properties: updatedProperties,
      };
    });
  };

  const removeProperty = (propertyId) => {
    const removePropertyFromNode = (node, propertyId) => {
      if (node.id === propertyId) {
        return null;
      }
      if (node.properties) {
        const updatedProperties = node.properties
          .map((childNode) => removePropertyFromNode(childNode, propertyId))
          .filter((childNode) => childNode != null);

        return { ...node, properties: updatedProperties };
      }
      return node;
    };
    setSchemaData((currentData) => {
      const updatedProperties = currentData.properties
        .map((node) => removePropertyFromNode(node, propertyId))
        .filter((node) => node != null);
      const updatedData = { ...currentData, properties: updatedProperties };

      return updatedData;
    });
  };

  const changeProperty = (propertyId, changes) => {
    const updateProperty = (node, propertyId, changes) => {
      if (node.id === propertyId) {
        let updatedNode = {
          ...node,
          name: changes.name,
          type: changes.type,
        };
        if (
          (changes.type === "object" || changes.type === "array") &&
          !updatedNode.properties
        ) {
          updatedNode.properties = [];
        } else if (changes.type !== "object" && changes.type !== "array") {
          delete updatedNode.properties;
        }
        return updatedNode;
      }
      if (node.properties) {
        const updatedProperties = node.properties.map((childNode) =>
          updateProperty(childNode, propertyId, changes)
        );
        return { ...node, properties: updatedProperties };
      }
      return node;
    };

    setSchemaData((currentData) => {
      const updatedProperties = currentData.properties.map((node) =>
        updateProperty(node, propertyId, changes)
      );
      return { ...currentData, properties: updatedProperties };
    });
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SchemaPropertyEditor
              node={node}
              onNameChange={(newName) => {
                changeProperty(node.id, { name: newName, type: node.type });
              }}
              onTypeChange={(newType) => {
                changeProperty(node.id, { name: node.name, type: newType });
              }}
            />
            {(node.type === "object" || node.type === "array") && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addProperty({ type: "string", name: "newProperty" }, node.id);
                }}
              >
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </div>

          {level > 0 && (
            <IconButton
              size="small"
              style={{ marginLeft: "auto" }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeProperty(node.id);
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
        : null}
    </TreeItem>
  );

  const schemaOutput = () => {
    const removeIds = (node) => {
      const { id, properties, ...rest } = node;
      if (node.type === "object" && properties) {
        return { ...rest, properties: properties.map(removeIds) };
      }
      return rest;
    };
    return removeIds(schemaData);
  };

  const schemaOutputWithIDs = () => schemaData;

  Schema.addProperty = addProperty;
  Schema.schemaOutput = schemaOutput;
  Schema.schemaOutputWithIDs = schemaOutputWithIDs;
  Schema.removeProperty = removeProperty;
  Schema.changeProperty = changeProperty;
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={["1"]}
      onNodeToggle={() => console.log(schemaOutputWithIDs())}
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
        },
        ".MuiTreeItem-label": {
          width: "100%",
        },
      }}
    >
      {renderTree(schemaData, 0)}
    </TreeView>
  );
};

export default Schema;

const SchemaPropertyEditor = ({ node, onNameChange, onTypeChange }) => {
  const [editMode, setEditMode] = useState(null);
  const [name, setName] = useState(node.name);
  const [type, setType] = useState(node.type);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleBlur = () => {
    if (editMode === "name") {
      onNameChange(name);
    } else if (editMode === "type") {
      onTypeChange(type);
    }
    setEditMode(null);
    setIsSelectOpen(false);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    onTypeChange(newType);
    setEditMode(null);
    setIsSelectOpen(false);
  };

  const propertyTypes = ["string", "integer", "boolean", "object", "array"];

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {editMode === "name" ? (
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleBlur()}
          disableUnderline
          autoFocus
          fullWidth
        />
      ) : (
        <span onClick={() => setEditMode("name")}>{node.name}</span>
      )}

      {editMode === "type" ? (
        <Select
          open={isSelectOpen}
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
          onClose={() => setIsSelectOpen(false)}
          onOpen={() => setIsSelectOpen(true)}
          fullWidth
        >
          {propertyTypes.map((typeOption) => (
            <MenuItem value={typeOption} key={typeOption}>
              {typeOption}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <span
          onClick={() => {
            setEditMode("type");
            setIsSelectOpen(true);
          }}
          style={getTypeStyle(node.type)}
        >
          {node.type}
        </span>
      )}
    </div>
  );
};
