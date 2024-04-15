import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";

function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const showConfirmDialog = (title, message, onConfirm) => {
    setTitle(title);
    setMessage(message);
    setOnConfirm(() => onConfirm);
    setOpen(true);
  };

  const hideConfirmDialog = () => {
    setOpen(false);
  };

  const ConfirmDialog = () => (
    <Dialog open={open} onClose={hideConfirmDialog}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideConfirmDialog}>Cancel</Button>
        <Button
          onClick={() => {
            onConfirm();
            hideConfirmDialog();
          }}
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

  return [ConfirmDialog, showConfirmDialog];
}

export default useConfirmDialog;
