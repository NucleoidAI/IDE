import Close from "@mui/icons-material/Close";
import React from "react";
import styles from "./styles";
import {
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

const GlobalMessageBox = ({ children, title, handleClose }) => {
  return (
    <Paper sx={styles.root} elevation={3}>
      <Box sx={styles.title}>
        <Typography sx={styles.titleText}>{title}</Typography>
        <IconButton onClick={handleClose}>
          <Close fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={styles.content}>{children}</Box>
      <Box sx={styles.footer}>
        <ProgressWithTime />
      </Box>
    </Paper>
  );
};

const ProgressWithTime = () => {
  return <LinearProgress sx={{ width: "100%" }} color="inherit" />;
};

export default GlobalMessageBox;
