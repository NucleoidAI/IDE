import { Box, ClickAwayListener, IconButton } from "@mui/material";
import React, { useState } from "react";

function ToggleableMenu({ defaultIcon, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDefaultIconClick = (event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMenuItemClick = (event) => {
    event.stopPropagation();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box>
        {isOpen ? (
          <Box onClick={handleMenuItemClick}>{children}</Box>
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
