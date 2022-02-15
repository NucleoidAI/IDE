import ClosableDialogTitle from "../../components/ClosableDialogTitle";
import SettingDialogTabs from "../../components/SettingDialogTabs";
//import styles from "./styles";
import { useContext } from "../../context";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { forwardRef, useRef, useState } from "react";

const SettingDialog = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [context, dispatch] = useContext();
  const { settings } = context;

  const urlsRef = useRef(settings.urls);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  ref.current = handleOpen;

  function saveSettingDialog() {
    dispatch({
      type: "SAVE_SETTING_DIALOG",
      payload: { urls: urlsRef.current },
    });
    handleClose();
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={"md"}
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
