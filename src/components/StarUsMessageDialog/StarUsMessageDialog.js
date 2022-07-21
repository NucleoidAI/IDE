import Close from "@mui/icons-material/Close";
import React from "react";
import Settings from "../../settings";
import Snackbar from "@mui/material/Snackbar";
import StarUsOnGithub from "../StarUsOnGithub";
import theme from "../../theme";
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
      <Paper
        sx={{
          backgroundColor: theme.palette.custom.messageBG,
          color: "rgba(0, 0, 0, 0.87)",
          fontSize: theme.typography.pxToRem(12),
          border: "1px solid #dadde9",
          maxWidth: 450,
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
          <Typography
            sx={{
              pl: 2,
              fontSize: "1rem",
              fontWeight: "bold",
              minWidth: "36px",
            }}
          >
            {" "}
          </Typography>
          <StarUsOnGithub source={"popper message"} color={"black"} />
          <IconButton onClick={handleClose}>
            <Close sx={{ fill: "black" }} fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ pr: 1.5, pl: 1.5 }}>
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
          </Box>
        </Box>
        <Box sx={{ minHeight: "25px" }}></Box>
      </Paper>
    </Snackbar>
  );
};

export default StarUsMessageDialog;
