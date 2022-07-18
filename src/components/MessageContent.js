import { Box, CircularProgress, Paper, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import React from "react";

import theme from "../theme";

export const MessageContent = ({ children }) => {
  return (
    <Paper
      sx={{
        bgcolor: "#353e48",
      }}
      elevation={3}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          color: "#c3c5c8",
        }}
      >
        <IconButton>
          <Close fontSize="small" />
        </IconButton>
      </Box>
      <Box>
        <CircularProgress size={15} />
        {children}
      </Box>
    </Paper>
  );
};
