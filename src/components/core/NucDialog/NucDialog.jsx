import { Close } from "@mui/icons-material";
import Fullscreen from "@mui/icons-material/Fullscreen";
import FullscreenExit from "@mui/icons-material/FullscreenExit";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";

export default function NucDialog({
  title,
  minWidth = 600,
  children,
  action,
  handleClose,
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Dialog
      open
      maxWidth={false}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          width: expanded ? "65rem" : "55rem",
          height: expanded ? "50rem" : "40rem",
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
      {expanded ? (
        <IconButton
          aria-label="collapse"
          onClick={() => setExpanded(false)}
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
          onClick={() => setExpanded(true)}
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
