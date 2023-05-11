import Close from "@mui/icons-material/Close";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import onboardDispatcher from "../Onboard/onboardDispatcher";
import styles from "./styles";
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
      <Paper sx={styles.root} elevation={3}>
        <Box sx={styles.titleContainer}>
          <Box />
          <Typography sx={styles.titleText}>Congrats!</Typography>
          <IconButton onClick={handleClose}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={styles.content}>
          <Typography>
            You&apos;ve created fully working APIs with the help of AI
          </Typography>
          <span style={{ fontSize: 20, marginLeft: 8 }}>🥳🎉</span>
        </Box>
        <Box sx={styles.footer}>
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
