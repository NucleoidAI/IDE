import ClosableDialogTitle from "../../components/ClosableDialogTitle";
import SettingDialogTabs from "../../components/SettingDialogTabs";
//import styles from "./styles";
import Settings from "../../settings";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { forwardRef, useRef, useState } from "react";

const SettingDialog = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const urlRef = useRef({ ...Settings.url });

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  ref.current = handleOpen;

  function saveSettingDialog() {
    Settings.url.terminal = urlRef.current.terminal;
    Settings.url.api = urlRef.current.api;
    handleClose();
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={"sm"}
      onClose={(event) => (event.key === "Escape" ? handleClose() : null)}
    >
      <ClosableDialogTitle label="SETTINGS" handleClose={() => handleClose()} />
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
});

export default SettingDialog;
