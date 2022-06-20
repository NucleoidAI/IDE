import React from "react";
import Settings from "../../settings";
import { Box, Switch, Typography } from "@mui/material";

const SettingsDialogAdvanced = () => {
  const [checked, setChecked] = React.useState(Settings.beta());
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Typography sx={{ pr: 1 }}>Beta :</Typography>
      <Switch
        checked={checked}
        color="primary"
        onChange={(e) => {
          setChecked(e.target.checked);
          Settings.beta(e.target.checked);
        }}
      />
    </Box>
  );
};

export default SettingsDialogAdvanced;
