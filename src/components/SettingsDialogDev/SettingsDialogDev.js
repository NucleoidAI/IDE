import React from "react";
import Settings from "../../settings";
import styles from "./styles";
import { Box, Switch, Typography } from "@mui/material";

const SettingsDialogDev = () => {
  const [checked, setChecked] = React.useState(Settings.beta());

  return (
    <Box sx={styles.root}>
      <Box sx={styles.itemContainer}>
        <Typography>Beta</Typography>
        <Switch
          color="secondary"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
            Settings.beta(e.target.checked);
          }}
        />
      </Box>
      <Box sx={styles.itemContainer}>
        <Typography>Debug</Typography>
        <Switch
          color="secondary"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
            Settings.beta(e.target.checked);
          }}
        />
      </Box>
    </Box>
  );
};

export default SettingsDialogDev;
