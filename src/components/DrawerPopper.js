import MessageContent from "../components/MessageContent";
import React from "react";
import { Box, ClickAwayListener, Popper } from "@mui/material";

const DrawerPopper = ({
  children,
  openPopover,
  anchorEl,
  title,
  handleClosePopper,
}) => {
  return (
    <ClickAwayListener onClickAway={handleClosePopper}>
      <Popper
        placement="left"
        disablePortal={false}
        open={openPopover}
        anchorEl={anchorEl}
        sx={{ zIndex: 999999, pr: "5px" }}
        modifiers={[
          {
            name: "flip",
            enabled: false,
            options: {
              altBoundary: false,
              rootBoundary: "viewport",
            },
          },
          {
            name: "preventOverflow",
            enabled: false,
            options: {
              altAxis: false,
              altBoundary: false,
              tether: false,
              rootBoundary: "viewport",
            },
          },
        ]}
      >
        <MessageContent title={title} handleClose={handleClosePopper}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pb: 1,
            }}
          >
            {children}
          </Box>
        </MessageContent>
      </Popper>
    </ClickAwayListener>
  );
};

export default DrawerPopper;
