import CloseIcon from "@mui/icons-material/Close";
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

export default function CodeSandboxDialog({ handleCloseSandboxDialog }) {
  return (
    <Dialog
      fullScreen
      open={true}
      onClose={handleCloseSandboxDialog}
      TransitionComponent={Transition}
    >
      <AppBar
        sx={{
          position: "relative",
          backgroundColor: "#424242",
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
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            codesandbox
          </Typography>
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
