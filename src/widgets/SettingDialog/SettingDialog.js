import ClosableDialogTitle from "../../components/ClosableDialogTitle";
import React from "react";
import SettingDialogTabs from "../../components/SettingDialogTabs";
import Settings from "../../settings";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

const SettingsDialog = ({ handleClose }) => {
  const terminal = Settings.url.terminal();
  const app = Settings.url.getApp();

  const urlRef = React.useRef({ terminal, app });

  function saveSettingDialog() {
    Settings.url.terminal(urlRef.current.terminal);
    Settings.url.setApp(urlRef.current.api);
    Settings.url.setEditor(urlRef.current.api + "/lint");
    handleClose();
  }

  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth={"sm"}
      onClose={(event) => (event.key === "Escape" ? handleClose() : null)}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      PaperProps={{
        style: {
          backgroundColor: "#424242",
          color: "#e0e0e0",
        },
      }}
    >
      <ClosableDialogTitle label="Setting" handleClose={() => handleClose()} />
      <DialogContent>
        <SettingDialogTabs ref={urlRef} />
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
