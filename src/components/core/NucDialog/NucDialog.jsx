import { Close } from "@mui/icons-material";
import Fullscreen from "@mui/icons-material/Fullscreen";
import FullscreenExit from "@mui/icons-material/FullscreenExit";
import React from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { storage, useStorage } from "@nucleoidjs/webstorage";

export default function NucDialog({
  title,
  minWidth = 600,
  children,
  action,
  open,
  handleClose,
  maximizedDimensions = { width: "65rem", height: "50rem" },
  minimizedDimensions = { width: "55rem", height: "40rem" },
}) {
  const [maximized] = useStorage("platform", title, "maximized", false);
  const currentDimensions = maximized
    ? maximizedDimensions
    : minimizedDimensions;

  return (
    <Dialog
      open={open}
      maxWidth={false}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          width: currentDimensions.width,
          height: currentDimensions.height,
          transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        {title}
      </DialogTitle>
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
      {maximized ? (
        <IconButton
          aria-label="collapse"
          onClick={() => storage.set("platform", title, "maximized", false)}
          sx={{
            position: "absolute",
            right: 48,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <FullscreenExit />
        </IconButton>
      ) : (
        <IconButton
          aria-label="expand"
          onClick={() => storage.set("platform", title, "maximized", true)}
          sx={{
            position: "absolute",
            right: 48,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Fullscreen />
        </IconButton>
      )}

      <DialogContent
        sx={{
          minWidth,
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        {children}
      </DialogContent>
      <DialogActions
        sx={{ backgroundColor: (theme) => theme.palette.background.default }}
      >
        {action}
      </DialogActions>
    </Dialog>
  );
}
