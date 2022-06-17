import React from "react";
import Settings from "../../settings";
import styles from "./styles";
import {
  Box,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

const SettingsDialogUrl = React.forwardRef((props, urlRef) => {
  const [npx, setNpx] = React.useState(
    Settings.runtime() === "npx" ? true : false
  );
  const url = urlRef.current;

  React.useEffect(() => {
    Settings.runtime(npx ? "npx" : "sandbox");
  }, [npx]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Typography sx={{ pr: 2 }}>Selected runtime</Typography>
        <FormControlLabel
          control={
            <Switch checked={npx} onChange={(e) => setNpx(e.target.checked)} />
          }
          label={npx ? "npx" : "CodeSandbox"}
        />
      </Box>
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
    </>
  );
});

export default SettingsDialogUrl;
