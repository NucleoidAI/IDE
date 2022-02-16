import ClosableDialogTitle from "../../components/ClosableDialogTitle";
import SettingDialogTabs from "../../components/SettingDialogTabs";
//import styles from "./styles";
import Settings from "../../settings";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { forwardRef, useRef, useState } from "react";

const SettingDialog = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const urlsRef = useRef({ ...Settings.urls });

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  ref.current = handleOpen;

  function saveSettingDialog() {
    Settings.urls.nucleoid = urlsRef.current.nucleoid;
    Settings.urls.openApi = urlsRef.current.openApi;
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
        <SettingDialogTabs ref={urlsRef} />
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
