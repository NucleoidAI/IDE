import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Settings from "../settings";
import Swagger from "../icons/Swagger";
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
import * as React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SwaggerDialog({ open, handleClose }) {
  const [sandbox, setSandbox] = React.useState(false);

  const switchNpxToSandbox = () => {
    Settings.runtime("sandbox");
  };

  return (
    <Dialog
      fullScreen
      open={open === undefined ? false : open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar
        sx={{
          position: "relative",
          backgroundColor: "#323a40",
          color: "#e0e0e0",
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
              <IconButton
                edge="start"
                onClick={() => {
                  if (sandbox) {
                    switchNpxToSandbox();
                  }
                  handleClose();
                }}
                aria-label="close"
              >
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
                <Swagger />
                <Typography sx={{ pl: 1 }} variant="h6" component="div">
                  Swagger
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>Run on CodeSanddbox</Typography>

              <Switch
                checked={sandbox}
                color="default"
                onChange={(e) => {
                  setSandbox(e.target.checked);
                }}
              />
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
