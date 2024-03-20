import { Box, IconButton, TextField } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import React, { useState } from "react";

const TypeEditor = ({ initialValue = "", onConfirm, onCancel }) => {
  const [typeName, setTypeName] = useState(initialValue);

  const handleConfirm = () => {
    onConfirm(typeName);
    setTypeName("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <TextField
        value={typeName}
        onChange={(e) => setTypeName(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ width: "60%", marginRight: 1 }}
      />
      <Box>
        <IconButton onClick={handleConfirm} size="small">
          <Check />
        </IconButton>
        <IconButton onClick={onCancel} size="small">
          <Close />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TypeEditor;
