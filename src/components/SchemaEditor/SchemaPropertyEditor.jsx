import { getTypeStyle } from "./SchemaUtils";

import { Input, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";

const SchemaPropertyEditor = ({
  node,
  onNameChange,
  onTypeChange,
  customTypes,
}) => {
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

  const propertyTypes = [
    "string",
    "integer",
    "boolean",
    "object",
    "array",
    ...customTypes.map((type) => type.name),
  ];

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
          onClose={() => {
            setEditMode(null);
            setIsSelectOpen(false);
          }}
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

export default SchemaPropertyEditor;
