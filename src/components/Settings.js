import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import makeStyles from "@mui/styles/makeStyles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  icon: {
    fill: theme.palette.custom.grey,
  },
  button: {
    color: theme.palette.custom.grey,
  },
}));

function Settings() {
  const classes = useStyles();

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
      <Grid container direction={"column"} justifyContent="center">
        <Button
          variant={"text"}
          className={classes.button}
          onClick={() => setConnect(!connect)}
        >
          {!connect ? "Connect" : "Disconnect"}
        </Button>
        <IconButton onClick={handleOpen} size="large">
          <SettingsIcon className={classes.icon} fontSize={"large"} />
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
