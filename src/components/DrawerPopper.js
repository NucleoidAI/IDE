import MessageContent from "../components/MessageContent";
import React from "react";
import {
  Box,
  ClickAwayListener,
  Popper,
  IconButton,
  Typography,
} from "@mui/material";

import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";

const DrawerPopper = ({ title }) => {
  const [open, setOpen] = React.useState(true);
  console.log(document.getElementsByClassName("nuc"));
  const handleClosePopper = () => {
    setOpen(false);
  };
  return (
    <ClickAwayListener onClickAway={handleClosePopper}>
      <Popper
        placement="left"
        disablePortal={false}
        open={open}
        // anchorEl={anchorEl}
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
            <IconButton>
              <PlayCircleFilledIcon sx={{ width: 35, height: 35 }} />
            </IconButton>
            <Box
              sx={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <Typography>Run sample project on</Typography>
              <Typography>CodeSandbox</Typography>
            </Box>
          </Box>
        </MessageContent>
      </Popper>
    </ClickAwayListener>
  );
};

export default DrawerPopper;
