import Close from "@mui/icons-material/Close";
import React from "react";
import theme from "../../theme";
import {
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

const GlobalMessageBox = ({ children, title, handleClose }) => {
  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.custom.messageBG,
        color: "rgba(0, 0, 0, 0.87)",
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
        minWidth: "250px",
      }}
      elevation={3}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxHeight: "25px",
        }}
      >
        <Typography sx={{ pl: 1, fontSize: "1rem", fontWeight: "bold" }}>
          {title}
        </Typography>
        <IconButton onClick={handleClose}>
          <Close fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ ml: 1.5, mr: 1.5 }}>{children}</Box>
      <Box
        sx={{
          maxHeight: "25px",
          minHeight: "25px",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        <ProgressWithTime />
      </Box>
    </Paper>
  );
};

const ProgressWithTime = ({ time }) => {
  return <LinearProgress sx={{ width: "100%" }} color="inherit" />;
};

export default GlobalMessageBox;
