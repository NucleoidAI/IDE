import MessageContent from "../components/MessageContent";
import React from "react";
import { Box, ClickAwayListener, Popper, Typography } from "@mui/material";

const DrawerPopper = ({
  children,
  openPopover,
  anchorEl,
  title,
  handleClosePoper,
}) => {
  return (
    <ClickAwayListener onClickAway={handleClosePoper}>
      <Popper
        placement="left-end"
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
        <MessageContent title={title} handleClose={handleClosePoper}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ pl: 2 }}>Run project in sandbox</Typography>
            <span style={{ fontSize: 30, marginLeft: 15 }}>
              &#128073;&#127996;
            </span>
          </Box>
        </MessageContent>
      </Popper>
    </ClickAwayListener>
  );
};

export default DrawerPopper;
