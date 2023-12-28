import { getTypeStyle } from "./SchemaUtils";

import { Box, Input, MenuItem, Select, Typography } from "@mui/material";
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        gap: "8px",
      }}
    >
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
        <Typography
          variant="body2"
          onClick={() => setEditMode("name")}
          sx={{
            cursor: "pointer",
            fontWeight: "bold", // Make text bolder
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {node.name}
        </Typography>
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
        >
          {propertyTypes.map((typeOption) => (
            <MenuItem value={typeOption} key={typeOption}>
              {typeOption}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Typography
          variant="body2"
          onClick={() => {
            setEditMode("type");
            setIsSelectOpen(true);
          }}
          sx={{
            cursor: "pointer",
            textAlign: "left",

            "&:hover": { textDecoration: "underline" },
          }}
        >
          {node.type}
        </Typography>
      )}
    </Box>
  );
};

export default SchemaPropertyEditor;
