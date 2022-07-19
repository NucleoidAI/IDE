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
        bgcolor: theme.palette.custom.drawerBG,
        width: "100%",
      }}
      elevation={3}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#c3c5c8",
        }}
      >
        <Typography sx={{ pl: 1 }}>{title}</Typography>
        <IconButton onClick={handleClose}>
          <Close
            sx={{ fill: theme.palette.custom.textGray }}
            fontSize="small"
          />
        </IconButton>
      </Box>
      <Box sx={{ p: 1 }}>{children}</Box>
      <ProgressWithTime />
    </Paper>
  );
};

const ProgressWithTime = ({ time }) => {
  return <LinearProgress color="inherit" />;
};

export default MessageContent;
