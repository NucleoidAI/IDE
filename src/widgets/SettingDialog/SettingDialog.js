import ClosableDialogTitle from "../../components/ClosableDialogTitle";
import SettingDialogTabs from "../../components/SettingDialogTabs";
import styles from "./styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { forwardRef } from "react";

const SettingDialog = forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  ref.current = handleOpen;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={"md"}
      onClose={(event) => (event.key === "Escape" ? handleClose() : null)}
    >
      <ClosableDialogTitle label="SETTINGS" handleClose={() => handleClose()} />
      <DialogContent>
        <SettingDialogTabs />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => handleClose()}
          variant={"text"}
          style={{ color: "#90caf9" }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default SettingDialog;
