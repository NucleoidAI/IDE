import React from "react";
import Settings from "../../settings";
import styles from "./styles";

import { Box, Switch, Typography } from "@mui/material";

const SettingsDialogDev = () => {
  const [collapseCodeBlocks, setCollapseCodeBlocks] = React.useState(
    Settings.collapseCodeBlocks()
  );

  return (
    <Box sx={styles.root}>
      <Box sx={styles.itemContainer}>
        <Typography>Collapse Code Blocks</Typography>
        <Switch
          color="secondary"
          checked={collapseCodeBlocks}
          onChange={(e) => {
            setCollapseCodeBlocks(e.target.checked);
            Settings.collapseCodeBlocks(e.target.checked);
          }}
        />
      </Box>
    </Box>
  );
};

export default SettingsDialogDev;
