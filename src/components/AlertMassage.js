import { Alert } from "@mui/material";
import React from "react";
import Snackbar from "@mui/material/Snackbar";

export default function AlertMassage({ message }) {
  const [open, setOpen] = React.useState(true);

  function handleClose(event, reason) {
    if (reason === "clickaway") return;
    setOpen(false);
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="info">
        {message}
      </Alert>
    </Snackbar>
  );
}
