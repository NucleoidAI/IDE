import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import React from "react";
import Settings from "../settings";
import StarUsOnGithub from "./StarUsOnGithub";
import Swagger from "../icons/Swagger";
import onboardDispatcher from "./Onboard/onboardDispatcher";
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
import { publish, useEvent } from "@nucleoidai/react-event";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SwaggerDialog() {
  const theme = useTheme();
  const [swagger] = useEvent("SWAGGER_DIALOG", { open: false });

  function handleClose() {
    publish("SWAGGER_DIALOG", { open: false });

    if (Settings.landing().level < 3) {
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
                {Settings.runtime() === "custom" ? (
                  <>
                    <Swagger fill={theme.palette.custom.grey} />
                    <Typography sx={{ pl: 3 / 2 }} variant="h6" component="div">
                      Swagger
                    </Typography>
                  </>
                ) : (
                  <>
                    <Swagger fill={theme.palette.custom.grey} />
                    <Typography sx={{ pl: 3 / 2 }} variant="h6">
                      Sandbox
                    </Typography>
                    <OpenSwaggerNewTabButton url={Settings.url.app()} />
                  </>
                )}
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
        src={Settings.url.app()}
        style={{ width: "100%", height: "100%", border: 0 }}
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    </Dialog>
  );
}

function OpenSwaggerNewTabButton(props) {
  const theme = useTheme();
  const { url } = props;

  function handleClick() {
    publish("SWAGGER_DIALOG", { open: false });
    setTimeout(() => {
      window.open(url, "_blank");
    }, 300);
  }

  return (
    <IconButton onClick={handleClick}>
      <OpenInNewIcon sx={{ color: theme.palette.custom.grey }} />
    </IconButton>
  );
}
