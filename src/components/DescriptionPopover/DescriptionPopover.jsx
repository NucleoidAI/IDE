import React from "react";
import { Popover, TextField } from "@mui/material";

export const DescriptionPopover = ({
  anchorEl,
  open,
  setAnchorEl,
  anchorPos,
  value,
}) => {
  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: anchorPos.vertical,
        horizontal: anchorPos.horizontal,
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <TextField
        inputProps={{
          style: { fontFamily: "monospace", fontSize: 14 },
        }}
        sx={{ p: 1, width: 450 }}
        multiline
        rows={15}
        variant={"outlined"}
        value={value}
      />
    </Popover>
  );
};
