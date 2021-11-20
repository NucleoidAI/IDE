import { Alert } from "@material-ui/lab";
import React from "react";
import Snackbar from "@material-ui/core/Snackbar";

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
