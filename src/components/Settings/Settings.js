import SettingsDialog from "../../widgets/SettingsDialog";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "./styles";
import { useState } from "react";
import { Button, Grid } from "@mui/material";

function Settings({ size }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Grid container sx={styles.root}>
      <Button onClick={handleOpen} size="large">
        <SettingsIcon sx={styles.settingIcon} fontSize={size} />
      </Button>
      {open && <SettingsDialog handleClose={handleClose} />}
    </Grid>
  );
}

export default Settings;
