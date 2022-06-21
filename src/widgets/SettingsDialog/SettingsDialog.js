import ClosableDialogTitle from "../../components/ClosableDialogTitle";
import React from "react";
import Settings from "../../settings";
import SettingsDialogTabs from "../../components/SettingsDialogTabs";
import useLayout from "../../hooks/useLayout";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

const SettingsDialog = ({ handleClose }) => {
  const [, dispatch] = useLayout();

  const urlRef = React.useRef();

  React.useEffect(() => {
    const terminal = Settings.url.terminal();
    const runtime = Settings.runtime();
    const parse = new URL(terminal);

    const url = parse.protocol + "//" + parse.hostname;
    urlRef.current = { runtime, url };
  }, []);

  function saveSettingDialog() {
    if (urlRef.current.runtime === "npx") {
      const url = new URL(urlRef.current.url);

      const terminal = url.protocol + "//" + url.hostname + ":8448/";
      const app = url.protocol + "//" + url.hostname + ":3000/";

      Settings.url.terminal(terminal);
      Settings.url.app(app);
    }
    Settings.runtime(urlRef.current.runtime);
    dispatch({ type: "SWAGGER_DIALOG", payload: { dialogStatus: false } });
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
