import ClosableDialogTitle from "../../components/ClosableDialogTitle";
import React from "react";
import Settings from "../../settings";
import SettingsDialogTabs from "../../components/SettingsDialogTabs";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

const SettingsDialog = ({ handleClose }) => {
  const terminal = Settings.url.terminal();
  const app = Settings.url.app();

  const urlRef = React.useRef({ terminal, app });

  function saveSettingDialog() {
    Settings.url.terminal(urlRef.current.terminal);
    Settings.url.app(urlRef.current.api);
    handleClose();
  }

  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth={"sm"}
      onClose={(event) => (event.key === "Escape" ? handleClose() : null)}
      sx={{ bgcolor: "rgba(0,0,0,0.5)" }}
      PaperProps={{
        style: {
          backgroundColor: "#424242",
          color: "#e0e0e0",
        },
      }}
    >
      <ClosableDialogTitle label="Settings" handleClose={() => handleClose()} />
      <DialogContent>
        <SettingsDialogTabs ref={urlRef} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => saveSettingDialog()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
