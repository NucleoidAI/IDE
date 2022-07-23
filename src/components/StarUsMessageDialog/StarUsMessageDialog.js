import Close from "@mui/icons-material/Close";
import React from "react";
import Settings from "../../settings";
import Snackbar from "@mui/material/Snackbar";
import StarUsOnGithub from "../StarUsOnGithub";
import styles from "./styles";
import { Box, IconButton, Paper, Typography } from "@mui/material";

const StarUsMessageDialog = ({ message, openTime }) => {
  const { vertical, horizontal } = message;
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
      Settings.landing({ level: 5 });
    }, openTime);
    return () => clearTimeout(timer);
  }, [openTime]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical, horizontal }}
      key={vertical + horizontal}
    >
      <Paper sx={styles.root} elevation={3}>
        <Box sx={styles.title}>
          <Typography sx={styles.titleText}> </Typography>
          <StarUsOnGithub
            clickEvent={handleClose}
            source={"popper message"}
            color={"black"}
          />
          <IconButton onClick={handleClose}>
            <Close sx={{ fill: "black" }} fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={styles.content}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 14 }}>
              &emsp;Thanks to declarative programming, we have a brand-new
              approach to data and logic. As we are still discovering what we
              can do with this powerful programming model, please join us with
              any types of contribution!
            </Typography>
            <img
              src={"https://cdn.nucleoid.com/media/nobel.png"}
              alt={"Nobel"}
              width={65}
              height={65}
            />
          </Box>
        </Box>
        <Box sx={styles.footer}></Box>
      </Paper>
    </Snackbar>
  );
};

export default StarUsMessageDialog;
