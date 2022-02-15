import SettingsIcon from "@mui/icons-material/Settings";
import SettingDialog from "../../widgets/SettingDialog/SettingDialog";
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

import React, { useState, useRef } from "react";

function Settings() {
  const [connect, setConnect] = useState(false);
  const handleOpenRef = useRef();

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
        <IconButton onClick={() => handleOpenRef.current()} size="large">
          <SettingsIcon sx={styles.settingIcon} fontSize={"large"} />
          <SettingDialog ref={handleOpenRef} />
        </IconButton>
      </Grid>
    </>
  );
}

export default Settings;
