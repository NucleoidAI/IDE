import CopyClipboard from "./CopyClipboard";
import DialogTooltip from "./DialogTootip";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import React from "react";
import Settings from "../settings";
import StarUsOnGithub from "./StarUsOnGithub";
import Swagger from "../icons/Swagger";
import onboardDispatcher from "./Onboard/onboardDispatcher";
import theme from "../theme";
import {
  AppBar,
  Box,
  Dialog,
  IconButton,
  Slide,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { publish, useEvent } from "../hooks/useEvent";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SwaggerDialog() {
  const [swagger] = useEvent("SWAGGER_DIALOG", { open: false });

  function handleClose() {
    publish("SWAGGER_DIALOG", { open: false });

    if (Settings.landing().level < 3) {
      setTimeout(() => {
        onboardDispatcher({ level: 3 });
      }, 1000);
    }

    // TODO ping runtime
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
          backgroundColor: "#323a40",
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
                {Settings.runtime() === "npx" ? (
                  <>
                    <Swagger fill={theme.palette.custom.grey} />
                    <Typography sx={{ pl: 3 / 2 }} variant="h6" component="div">
                      Swagger
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography sx={{ pl: 3 / 2 }} variant="h6">
                      nuc sandbox
                    </Typography>
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
              <RuntimeSwitch />
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

function RuntimeSwitch() {
  const [sandbox, setSandbox] = React.useState(
    Settings.runtime() === "sandbox" ? true : false
  );
  const [alert, setAlert] = React.useState(false);

  function handleSwitch() {
    if (sandbox) {
      Settings.runtime("npx");
      setAlert(true);
    }
    if (!sandbox) {
      Settings.runtime("sandbox");
      setAlert(false);
    }

    setSandbox(!sandbox);
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <DialogTooltip
          open={alert}
          placement="bottom-start"
          title={<b>Runtime</b>}
          message={
            <>
              Run the following code in your terminal
              <br />
              <CopyClipboard />
              <br />
            </>
          }
          handleTooltipClose={() => setAlert(false)}
        >
          <Typography
            fontWeight={!sandbox ? "bold" : null}
            sx={{ pr: 1, fontSize: !sandbox ? "16px" : "15px" }}
          >
            npx
          </Typography>
        </DialogTooltip>
      </Box>
      <Box
        sx={{
          width: "30%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Switch checked={sandbox} color="default" onChange={handleSwitch} />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Typography
          fontWeight={sandbox ? "bold" : null}
          sx={{
            pl: 1,
            fontSize: sandbox ? "16px" : "15px",
            width: 108,
          }}
        >
          nuc sandbox
        </Typography>
      </Box>
    </Box>
  );
}
