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
  const [name, setName] = useState(node.name || "");
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

  const isRootNode = node.level === 0;

  const propertyTypes = isRootNode
    ? ["object", "array", ...customTypes.map((type) => type.name)]
    : [
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
      {!disableNameChange ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            gap: "4px",
          }}
          onClick={() => {
            setEditMode("name");
          }}
        >
          <Input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            disableUnderline
            fullWidth
            sx={{
              borderBottom: "2px solid transparent",
              "&:hover": {
                borderBottom: "2px solid gray",
              },
              "&:focus": {
                borderBottom: "2px solid blue",
              },
            }}
            data-cy={`property-name-field-${node.id}`}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        ></Box>
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
            <MenuItem
              value={typeOption}
              key={typeOption}
              data-cy={`property-type-option-${typeOption}`}
            >
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
            data-cy={`property-type-select-${node.id}`}
          >
            {node.type}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SchemaPropertyEditor;
