import { Box, Input, MenuItem, Select, Typography } from "@mui/material";
import React, { useState } from "react";

const SchemaPropertyEditor = ({
  node,
  onNameChange,
  disableNameChange,
  onTypeChange,
  customTypes,
}) => {
  const [editMode, setEditMode] = useState(null);
  const [name, setName] = useState(node.name);
  const [type, setType] = useState(node.type);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleNameChange = (newName) => {
    setName(newName);
    onNameChange(newName);
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
          disableUnderline
          disabled={disableNameChange}
          fullWidth
          sx={{
            borderBottom: "1px solid lightgray",
            "&:hover": {
              borderBottom: "2px solid gray",
            },
            "&:focus": {
              borderBottom: "2px solid blue",
            },
          }}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            gap: "4px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setEditMode("name");
          }}
        >
          <Input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            disabled={disableNameChange}
            disableUnderline
            autoFocus
            fullWidth
            sx={{
              "&:hover": {
                borderBottom: "2px solid gray",
              },
              "&:focus": {
                borderBottom: "2px solid blue",
              },
            }}
          />
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
