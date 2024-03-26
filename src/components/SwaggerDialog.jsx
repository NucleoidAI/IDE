import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import React from "react";
import StarUsOnGithub from "./StarUsOnGithub";
import Swagger from "../icons/Swagger";
import onboardDispatcher from "./Onboard/onboardDispatcher";
import sandboxService from "../sandboxService";
import { useTheme } from "@mui/material/styles";

import {
  AppBar,
  Box,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import { publish, useEvent } from "@nucleoidjs/react-event";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SwaggerDialog() {
  const theme = useTheme();
  const [swagger] = useEvent("SWAGGER_DIALOG", { open: false });

  function handleClose() {
    publish("SWAGGER_DIALOG", { open: false });

    if (sandboxService.getLandingLevel() < 3) {
      setTimeout(() => {
        onboardDispatcher({ level: 3 });
      }, 1000);
    }
  }

  React.useEffect(() => {}, [swagger.open]);

  return (
    <Dialog
      fullScreen
      open={swagger.open || false}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar
        sx={{
          position: "relative",
          backgroundColor: "#343a43",
          color: theme.palette.custom.grey,
        }}
      >
        <Toolbar>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton edge="start" onClick={handleClose} aria-label="close">
                <KeyboardArrowDown sx={{ color: "#e0e0e0" }} fontSize="large" />
              </IconButton>
              <Box
                sx={{
                  ml: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Swagger fill={theme.palette.custom.grey} />
                <Typography sx={{ pl: 3 / 2 }} variant="h6">
                  Sandbox
                </Typography>
                <OpenSwaggerNewTabButton />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StarUsOnGithub />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <iframe
        title="Swagger"
        src={sandboxService.getAppUrl()}
        style={{ width: "100%", height: "100%", border: 0 }}
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    </Dialog>
  );
}

function OpenSwaggerNewTabButton() {
  const theme = useTheme();

  function handleClick() {
    publish("SWAGGER_DIALOG", { open: false });
    setTimeout(() => {
      window.open(sandboxService.getAppUrl(), "_blank");
    }, 300);
  }

  return (
    <IconButton onClick={handleClick}>
      <OpenInNewIcon sx={{ color: theme.palette.custom.grey }} />
    </IconButton>
  );
}
