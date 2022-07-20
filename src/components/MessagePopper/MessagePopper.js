import MessageContent from "../MessageContent";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import React from "react";
import Settings from "../../settings";
import onboardDispatcher from "../Onboard/onboardDispatcher";
import { Box, IconButton, Popper, Typography } from "@mui/material";

const MessagePopper = ({ title }) => {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState([]);

  React.useEffect(() => {
    setTimeout(() => {
      if (Settings.landing().level === 1) {
        setPos(document.getElementsByName("onboardRun"));
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 7000);
      }
    }, 5000);
  }, [pos]);

  const handleClosePopper = () => {
    setOpen(false);
    onboardDispatcher({ level: 2 });
  };

  return (
    <Popper
      placement="left"
      disablePortal={false}
      open={open}
      anchorEl={pos[0]}
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
  );
};

export default MessagePopper;
