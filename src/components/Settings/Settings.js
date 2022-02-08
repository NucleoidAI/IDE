import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "./styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";

function Settings() {
  const [open, setOpen] = React.useState(false);
  const [connect, setConnect] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid container sx={styles.root}>
        <Button
          variant={"text"}
          sx={{ color: (theme) => theme.palette.custom.grey }}
          onClick={() => setConnect(!connect)}
        >
          {!connect ? "Connect" : "Disconnect"}
        </Button>
        <IconButton onClick={handleOpen} size="large">
          <SettingsIcon
            sx={{ fill: (theme) => theme.palette.custom.grey }}
            fontSize={"large"}
          />
        </IconButton>
      </Grid>
      <Dialog
        onClose={handleClose}
        aria-labelledby="settings-dialog-title"
        open={open}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        PaperProps={{
          style: {
            backgroundColor: "#424242",
            color: "#ffffffb3",
          },
        }}
        fullWidth
        maxWidth={"sm"}
      >
        <DialogTitle id="settings-dialog-title" onClose={handleClose}>
          Settings
        </DialogTitle>
        <DialogContent>Settings</DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            variant={"text"}
            style={{ color: "#90caf9" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Settings;
