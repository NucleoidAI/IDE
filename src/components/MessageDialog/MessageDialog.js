import React from "react";
import Snackbar from "@mui/material/Snackbar";
import StarUsOnGithub from "../StarUsOnGithub";

import {
  Box,
  LinearProgress,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";

import theme from "../../theme";

const MessageDialog = ({ message, handleCloseMessage }) => {
  const { vertical, horizontal, open, msg } = message;

  return (
    <Snackbar
      open={open}
      onClose={handleCloseMessage}
      anchorOrigin={{ vertical, horizontal }}
      autoHideDuration={msg === "success" ? 6000 : 10000}
      key={vertical + horizontal}
    >
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
          <Typography sx={{ pl: 2 }}>
            {msg === "success" ? "Congrats!" : "Star"}
          </Typography>
          <IconButton onClick={handleCloseMessage}>
            <Close
              sx={{ fill: theme.palette.custom.textGray }}
              fontSize="small"
            />
          </IconButton>
        </Box>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {msg === "success" ? <Congrats /> : <Star />}
          </Box>
        </Box>
        <ProgressWithTime />
      </Paper>
    </Snackbar>
  );
};

const Star = () => {
  return (
    <>
      <StarUsOnGithub />
      <span style={{ fontSize: 25, marginLeft: 15 }}>🥳 🎉</span>
    </>
  );
};

const Congrats = () => {
  return (
    <>
      <Typography sx={{ color: "#c3c5c8" }}>
        You've created your APIs with the help of AI
      </Typography>
      <span style={{ fontSize: 25, marginLeft: 15 }}>🥳 🎉</span>
    </>
  );
};

const ProgressWithTime = ({}) => {
  return <LinearProgress color="inherit" />;
};

export default MessageDialog;
