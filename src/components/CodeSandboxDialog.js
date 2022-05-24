import CloseIcon from "@mui/icons-material/Close";
import Settings from "../settings";
import {
  AppBar,
  Dialog,
  Grid,
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
    <div>
      <Dialog
        fullScreen
        open={true}
        onClose={handleCloseSandboxDialog}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }} color={"default"}>
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
        <Grid>
          <iframe
            title="CodeSandbox"
            src={`https://codesandbox.io/embed/${Settings.codesandbox.getSandboxID()}?fontsize=14&hidenavigation=1&theme=dark&editorsize=35`}
            // src={`https://codesandbox.io/s/${Settings.codesandbox.getSandboxID()}?editorsize=100`}
            style={{ width: "100%", height: "880px" }}
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          ></iframe>
        </Grid>
      </Dialog>
    </div>
  );
}
