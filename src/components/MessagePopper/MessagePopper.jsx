import GlobalMessageBox from "../GlobalMessageBox";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import React from "react";
import Settings from "../../settings";
import onboardDispatcher from "../Onboard/onboardDispatcher";
import { publish } from "@nucleoidai/react-event";
import { Box, IconButton, Popper, Typography } from "@mui/material";

const MessagePopper = ({ title, openTime }) => {
  const [open, setOpen] = React.useState(false);
  const [disable, setDisable] = React.useState(false);
  const [pos, setPos] = React.useState([]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (Settings.landing().level === 1) {
        setPos(document.getElementsByName("onboardRun"));
        setOpen(true);
      }
    }, openTime);
    return () => clearTimeout(timer);
  }, [pos, openTime]);

  const handleClosePopper = () => {
    setOpen(false);
    onboardDispatcher({ level: 2 });
  };

  return (
    <Popper
      placement="left-start"
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
      <GlobalMessageBox title={title} handleClose={handleClosePopper}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            disabled={disable}
            sx={{ mr: 1 }}
            onClick={() => {
              setDisable(true);
              publish("RUN_BUTTON_CLICKED", { status: true });
            }}
          >
            <PlayCircleFilledIcon sx={{ width: 35, height: 35 }} />
          </IconButton>
          <Typography>Run sample project on sandbox</Typography>
        </Box>
      </GlobalMessageBox>
    </Popper>
  );
};

export default MessagePopper;
