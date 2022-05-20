import * as React from "react";
import Button from "@mui/material/Button";
import { Dialog, Grid } from "@mui/material";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Settings from "../settings";

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
            src={`https://codesandbox.io/s/${Settings.codesandbox.sandbox_id}`}
            style={{ width: "100%", height: "900px" }}
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          ></iframe>
        </Grid>
      </Dialog>
    </div>
  );
}