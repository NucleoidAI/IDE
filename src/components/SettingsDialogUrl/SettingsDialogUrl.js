import React from "react";
import styles from "./styles";
import { Box, Switch, TextField, Typography } from "@mui/material";

const SettingsDialogUrl = React.forwardRef((props, urlRef) => {
  const url = urlRef.current;

  return (
    <>
      <TextField
        label="Nucleoid Runtime URL"
        defaultValue={url["terminal"]}
        sx={styles.textField}
        onChange={(e) => (url["terminal"] = e.target.value)}
      />
      <TextField
        label="OpenAPI URL"
        defaultValue={url["app"]}
        sx={styles.textField}
        onChange={(e) => (url["app"] = e.target.value)}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Typography>select sandbox</Typography> <Switch />
      </Box>
    </>
  );
});

export default SettingsDialogUrl;
