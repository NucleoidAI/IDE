import Close from "@mui/icons-material/Close";
import React from "react";
import theme from "../theme";
import {
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

const MessageContent = ({ children, title, handleClose }) => {
  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.custom.messageBG,
        color: "rgba(0, 0, 0, 0.87)",
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
      }}
      elevation={3}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ pl: 1, fontSize: "1rem", fontWeight: "bold" }}>
          {title}
        </Typography>
        <IconButton onClick={handleClose}>
          <Close fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ pb: 1, pr: 1, pl: 1 }}>{children}</Box>
      <ProgressWithTime />
    </Paper>
  );
};

const ProgressWithTime = ({ time }) => {
  return <LinearProgress color="inherit" />;
};

export default MessageContent;
