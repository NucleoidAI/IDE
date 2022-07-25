import React from "react";
import Settings from "../../settings";
import { Box, Switch, Typography } from "@mui/material";

const SettingsDialogDev = () => {
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
        color="default"
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked);
          Settings.beta(e.target.checked);
        }}
      />
    </Box>
  );
};

export default SettingsDialogDev;
