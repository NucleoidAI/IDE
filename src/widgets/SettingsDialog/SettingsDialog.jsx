import ClosableDialogTitle from "../../components/ClosableDialogTitle";
import React from "react";
import Settings from "../../settings";
import SettingsDialogTabs from "../../components/SettingsDialogTabs";
import { publish } from "@nucleoidai/react-event";
import { useTheme } from "@mui/material/styles";

import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

const SettingsDialog = ({ handleClose }) => {
  const theme = useTheme();
  const urlRef = React.useRef();

  React.useEffect(() => {
    const terminal = Settings.url.terminal();
    const runtime = Settings.runtime();
    const parse = new URL(terminal);

    let url;

    if (runtime === "sandbox") {
      url = "https://nucleoid.com/sandbox/";
    } else {
      url = parse.protocol + "//" + parse.hostname + ":" + (parse.port || 80);
    }

    const description = Settings.description();
    urlRef.current = { runtime, url, description };
  }, []);

  function saveSettingDialog() {
    Settings.description(urlRef.current.description);
    Settings.runtime(urlRef.current.runtime);

    if (urlRef.current.runtime === "custom") {
      const url = new URL(urlRef.current.url);

      const terminal =
        url.protocol + "//" + url.hostname + ":" + (url.port || 80);
      const app = url.protocol + "//" + url.hostname + ":" + 3000;

      Settings.url.terminal(terminal);
      Settings.url.app(app);
    }

    publish("SWAGGER_DIALOG", { open: false });
    handleClose();
  }

  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth={"md"}
      onClose={(event) => (event.key === "Escape" ? handleClose() : null)}
      sx={{ bgcolor: "custom.darkDialogBg", zIndex: 999999999 }}
      PaperProps={{
        style: {
          backgroundColor: theme.palette.custom.darkDialog,
          color: "white",
          minHeight: 600,
        },
      }}
    >
      <ClosableDialogTitle
        grey
        label="Settings"
        handleClose={() => handleClose()}
      />
      <DialogContent>
        <SettingsDialogTabs ref={urlRef} />
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ color: "white" }}
          autoFocus
          onClick={() => saveSettingDialog()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
