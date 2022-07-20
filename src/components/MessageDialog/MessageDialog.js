import Close from "@mui/icons-material/Close";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import StarUsOnGithub from "../StarUsOnGithub";
import onboardDispatcher from "../Onboard/onboardDispatcher";
import theme from "../../theme";
import {
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

const MessageDialog = ({ message, time }) => {
  const { vertical, horizontal, msg, status } = message;
  const [open, setOpen] = React.useState(status);

  const handleClose = () => {
    onboardDispatcher({ level: 5 });
    setOpen(false);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, time);
    return () => clearTimeout(timer);
  }, [time]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical, horizontal }}
      autoHideDuration={msg === "success" ? 10000 : 12000}
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
            }}
          >
            <Typography sx={{ pl: 2, fontSize: "1rem", fontWeight: "bold" }}>
              {msg === "success" ? "Congrats!" : "Star"}
            </Typography>
            <IconButton onClick={handleClose}>
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
            }}
          >
            <Typography
              sx={{ pl: 2, fontSize: "1rem", fontWeight: "bold" }}
            ></Typography>
            <IconButton onClick={handleClose}>
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
