import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { v4 as uuidv4 } from "uuid";

import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TreeItem, TreeView } from "@mui/lab";

const SchemaProperty = ({ prop, onChange, nodeId, customTypes }) => {
  const isCustomType = customTypes.some((type) => type.name === prop.type);
  const renderCustomLabel = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0.5,
          padding: 0.5,
          borderRadius: 1,
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        {prop.properties.map((nestedProp) => (
          <Typography key={nestedProp.id}>
            {`"${nestedProp.name}": "${nestedProp.type}"`}
          </Typography>
        ))}
      </Box>
    );
  };

  const handlePropChange = (key, value) => {
    if (key === "type") {
      const customType = customTypes.find((type) => type.name === value);
      if (customType) {
        const updatedProperties = customType.schema.properties.map((prop) => ({
          id: Date.now(),
          name: prop.name,
          type: prop.type,
          properties: [],
        }));
        onChange({ ...prop, type: value, properties: updatedProperties });
      } else {
        onChange({ ...prop, [key]: value });
      }
    } else {
      onChange({ ...prop, [key]: value });
    }
  };

  const handleNestedChange = (nestedId, nestedProp) => {
    const updatedProperties = prop.properties.map((p) =>
      p.id === nestedId ? nestedProp : p
    );
    onChange({ ...prop, properties: updatedProperties });
  };

  const addNestedProperty = (event) => {
    event.stopPropagation();
    const newProp = {
      id: `nested-${prop.name}-${Date.now()}`,
      name: "",
      type: "string",
      properties: [],
    };
    onChange({ ...prop, properties: [...prop.properties, newProp] });
  };

  return (
    <TreeItem
      nodeId={nodeId}
      label={
        isCustomType ? (
          renderCustomLabel()
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              padding: 0.5,
              borderRadius: 1,
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <TextField
              size="small"
              variant="outlined"
              label="Name"
              value={prop.name}
              onChange={(e) => handlePropChange("name", e.target.value)}
              sx={{ flex: 2 }}
            />
            <Select
              size="small"
              variant="outlined"
              value={prop.type}
              onChange={(e) => handlePropChange("type", e.target.value)}
              sx={{ flex: 1, mr: 1 }}
            >
              <MenuItem value="string">String</MenuItem>
              <MenuItem value="integer">Integer</MenuItem>
              <MenuItem value="boolean">Boolean</MenuItem>
              <MenuItem value="array">Array</MenuItem>
              <MenuItem value="object">Object</MenuItem>
              {customTypes.map((type) => (
                <MenuItem key={type.name} value={type.name}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
            {["object", "array"].includes(prop.type) && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddCircleOutlineIcon />}
                onClick={addNestedProperty}
                sx={{ boxShadow: "none", textTransform: "none" }}
              >
                Nested
              </Button>
            )}
          </Box>
        )
      }
    >
      {["object", "array"].includes(prop.type) &&
        prop.properties.map((nestedProp) => (
          <SchemaProperty
            key={nestedProp.id}
            prop={nestedProp}
            onChange={(changedProp) =>
              handleNestedChange(nestedProp.id, changedProp)
            }
            nodeId={`${nodeId}-${nestedProp.id}`}
            customTypes={customTypes}
          />
        ))}
    </TreeItem>
  );
};

const NewSchema = ({ customTypes, onSchemaChange, initialSchema }) => {
  const parseInitialSchema = (initialSchema) => {
    const parseProperties = (properties) => {
      return properties.map((prop) => {
        return {
          id: uuidv4(),
          name: prop.name,
          type: prop.type,
          properties: prop.properties ? parseProperties(prop.properties) : [],
        };
      });
    };

    return {
      type: initialSchema.type,
      properties: initialSchema.properties
        ? parseProperties(initialSchema.properties)
        : [],
    };
  };

  const [expanded, setExpanded] = useState(["schema-root"]);
  const [schema, setSchema] = useState(() => {
    if (initialSchema) {
      return parseInitialSchema(initialSchema);
    }

    return { type: "object", properties: [] };
  });

  useEffect(() => {
    if (schema.type === "object" || schema.type === "array") {
      if (schema.properties.length === 0) {
        addProperty();
      }
    }
    // eslint-disable-next-line
  }, [schema.type]);

  useEffect(() => {
    onSchemaChange(schema);
  }, [schema, onSchemaChange]);

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    const customType = customTypes.find((type) => type.name === selectedType);

    if (customType) {
      const propertiesAsPlainText = customType.schema.properties
        .map((prop) => `${prop.name}: ${prop.type}, `)
        .join("\n");

      setSchema({
        ...schema,
        type: selectedType,
        properties: propertiesAsPlainText,
      });
    } else {
      setSchema({ ...schema, type: selectedType, properties: [] });
    }

    setExpanded(["schema-root"]);
  };

  const renderCustomTypeProperties = () => {
    if (typeof schema.properties === "string") {
      return (
        <div>
          {schema.properties.split("\n").map((line, index) => (
            <Typography key={index} variant="body2">
              {line}
            </Typography>
          ))}
        </div>
      );
    }
    return renderSchemaTree();
  };

  const addProperty = () => {
    const newProp = {
      id: `property-${schema.properties.length}-${Date.now()}`,
      name: "",
      type: "string",
      properties: [],
    };
    setSchema({ ...schema, properties: [...schema.properties, newProp] });
  };

  const handlePropertyChange = (id, updatedProp) => {
    const updatedProperties = schema.properties.map((p) =>
      p.id === id ? updatedProp : p
    );
    setSchema({ ...schema, properties: updatedProperties });
  };

  const renderSchemaTree = () => {
    return schema.properties.map((prop) => (
      <SchemaProperty
        key={prop.id}
        prop={prop}
        onChange={(updatedProp) => handlePropertyChange(prop.id, updatedProp)}
        nodeId={`root-${prop.id}`}
        customTypes={customTypes}
      />
    ));
  };

  return (
    <Box sx={{ height: "25rem" }}>
      <Box sx={{ p: 2 }}>
        <Select
          size="small"
          value={schema.type}
          onChange={handleTypeChange}
          sx={{ width: "100%", mb: 2 }}
        >
          <MenuItem value="object">Object</MenuItem>
          <MenuItem value="array">Array</MenuItem>
          {customTypes.map((type) => (
            <MenuItem key={type.name} value={type.name}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <TreeView
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
          expanded={expanded}
          onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
          sx={{ padding: 1, paddingBottom: 0 }}
        >
          <TreeItem
            nodeId="schema-root"
            label={
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {typeof schema.properties === "string"
                  ? `${schema.type} {}`
                  : schema.type === "object"
                  ? "Object {}"
                  : "Array []"}
              </Typography>
            }
          >
            {renderCustomTypeProperties()}
          </TreeItem>
        </TreeView>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 2,
          borderTop: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          endIcon={<AddCircleOutlineIcon />}
          onClick={addProperty}
          disabled={typeof schema.properties === "string"}
        >
          Add Property
        </Button>
      </Box>
    </Box>
  );
};

export default NewSchema;
