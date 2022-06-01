import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Settings from "../settings";
import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SwaggerDialog({open, handleClose }) {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar
        sx={{
          position: "relative",
          backgroundColor: "#424242",
          color: "#e0e0e0",
        }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <KeyboardArrowDown />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Swagger
          </Typography>
        </Toolbar>
      </AppBar>
      <iframe
        title="Swagger"
        src={Settings.url.app()}
        style={{ width: "100%", height: "100%" }}
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    </Dialog>
  );
}
