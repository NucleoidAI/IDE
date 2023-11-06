import { Close } from "@mui/icons-material";
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

export default function NucDialog({
  title,
  minWidth = 600,
  children,
  action,
  handleClose,
}) {
  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle sx={{ m: 0, p: 2 }}>{title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <DialogContent sx={{ minWidth }}>{children}</DialogContent>
      <DialogActions>{action}</DialogActions>
    </Dialog>
  );
}
