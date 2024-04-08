import { Box, ClickAwayListener, IconButton } from "@mui/material";
import React, { useState } from "react";

function ToggleableMenu({ defaultIcon, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDefaultIconClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box>
        {isOpen ? (
          <Box>{children}</Box>
        ) : (
          <IconButton size="small" onClick={handleDefaultIconClick}>
            {defaultIcon}
          </IconButton>
        )}
      </Box>
    </ClickAwayListener>
  );
}

export default ToggleableMenu;
