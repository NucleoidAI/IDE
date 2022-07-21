import Close from "@mui/icons-material/Close";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import onboardDispatcher from "../Onboard/onboardDispatcher";
import theme from "../../theme";
import {
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

const MessageDialog = ({ message, lifeTime }) => {
  const { vertical, horizontal, status } = message;
  const [open, setOpen] = React.useState(status);

  const handleClose = () => {
    onboardDispatcher({ level: 4 });
    setOpen(false);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, lifeTime);
    return () => clearTimeout(timer);
  }, [lifeTime]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical, horizontal }}
      key={vertical + horizontal}
    >
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
          <Box />
          <Typography sx={{ pl: 2.5, fontSize: "1rem", fontWeight: "bold" }}>
            Congrats!
          </Typography>
          <IconButton onClick={handleClose}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ ml: 2.5, mr: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>
              You've created your APIs with the help of AI
            </Typography>
            <span style={{ fontSize: 20, marginLeft: 15 }}>🥳 🎉</span>
          </Box>
        </Box>
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
    </Snackbar>
  );
};

const ProgressWithTime = ({ color }) => {
  return <LinearProgress color={color || "inherit"} />;
};

export default MessageDialog;
