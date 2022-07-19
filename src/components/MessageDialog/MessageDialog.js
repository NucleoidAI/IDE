import Close from "@mui/icons-material/Close";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import StarUsOnGithub from "../StarUsOnGithub";
import theme from "../../theme";
import {
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

const MessageDialog = ({ message, handleCloseMessage }) => {
  const { vertical, horizontal, open, msg } = message;

  return (
    <Snackbar
      open={open}
      onClose={handleCloseMessage}
      anchorOrigin={{ vertical, horizontal }}
      autoHideDuration={msg === "success" ? 10000 : 100000}
      key={vertical + horizontal}
    >
      {msg === "success" ? (
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
              // color: "#c3c5c8",
            }}
          >
            <Typography sx={{ pl: 2, fontSize: "1rem", fontWeight: "bold" }}>
              {msg === "success" ? "Congrats!" : "Star"}
            </Typography>
            <IconButton onClick={handleCloseMessage}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ p: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Congrats />
            </Box>
          </Box>
          <ProgressWithTime />
        </Paper>
      ) : (
        <Paper
          sx={{
            backgroundColor: "#0288d1",
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
              width: 250,
              // color: "#c3c5c8",
            }}
          >
            <Typography
              sx={{ pl: 2, fontSize: "1rem", fontWeight: "bold" }}
            ></Typography>
            <IconButton onClick={handleCloseMessage}>
              <Close sx={{ fill: "white" }} fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ pr: 1, pl: 1, pb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Star />
            </Box>
          </Box>
          <ProgressWithTime color={"secondary"} />
        </Paper>
      )}
    </Snackbar>
  );
};

const Star = () => {
  return (
    <>
      <StarUsOnGithub color={"white"} />
    </>
  );
};

const Congrats = () => {
  return (
    <>
      <Typography>You've created your APIs with the help of AI</Typography>
      <span style={{ fontSize: 20, marginLeft: 15 }}>🥳 🎉</span>
    </>
  );
};

const ProgressWithTime = ({ color }) => {
  return <LinearProgress color={color || "inherit"} />;
};

export default MessageDialog;
