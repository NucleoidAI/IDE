import CodeSandboxIcon from "../icons/CodeSandbox";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Settings from "../settings";
import {
  AppBar,
  Box,
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

export default function CodeSandboxDialog({ open, handleCloseSandboxDialog }) {
  return (
    <Dialog
      fullScreen
      open={open === undefined ? false : open}
      onClose={handleCloseSandboxDialog}
      TransitionComponent={Transition}
      aria-describedby="alert-dialog-slide-description"
    >
      <AppBar
        sx={{
          position: "relative",
          backgroundColor: "#323a40",
          color: "#e0e0e0",
        }}
        color={"default"}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleCloseSandboxDialog}
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
            <CodeSandboxIcon fill={"#e0e0e0"} />
            <Typography sx={{ pl: 1 }} variant="h6">
              CodeSandbox
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <iframe
        title="CodeSandbox"
        src={`https://codesandbox.io/embed/${Settings.codesandbox.sandboxID()}?fontsize=14&hidenavigation=1&theme=dark&editorsize=35`}
        style={{
          width: "100%",
          height: "100%",
          border: 0,
        }}
        //onLoad={() => setClose(false)}
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    </Dialog>
  );
}
