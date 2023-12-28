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
    "number",
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
        gap: "4px",
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
          sx={{
            fontFamily: "monospace",
            border: "1px solid lightgray",
            borderRadius: "4px",
          }}
        />
      ) : (
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => setEditMode("name")}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              padding: "2px 2px",
              borderRadius: "4px",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {node.name}
            {node.name && ":"} {/* Conditionally render the colon */}
          </Typography>
        </Box>
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
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <Typography
            variant="body2"
            onClick={() => {
              setEditMode("type");
              setIsSelectOpen(true);
            }}
            sx={{
              cursor: "pointer",
              fontFamily: "monospace",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.grey[600],
              },
            }}
          >
            {node.type}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SchemaPropertyEditor;
