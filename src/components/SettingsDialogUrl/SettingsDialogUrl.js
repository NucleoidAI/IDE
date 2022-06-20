import React from "react";
import styles from "./styles";
import { Box, Switch, TextField, Typography } from "@mui/material";

const SettingsDialogUrl = React.forwardRef((props, urlRef) => {
  const [terminal, setTerminal] = React.useState(urlRef.current.terminal);
  const [app, setApp] = React.useState(urlRef.current.app);
  const [npx, setNpx] = React.useState(
    urlRef.current.runtime === "npx" ? true : false
  );

  const url = urlRef.current;

  React.useEffect(() => {}, []);

  const handleSetTerminal = (value) => {
    url["terminal"] = value;
    setTerminal(value);
  };
  const handleSetApp = (value) => {
    url["app"] = value;
    setApp(value);
  };

  const handleSetRuntime = (value) => {
    url["runtime"] = value ? "npx" : "sandbox";
    if (
      url["runtime"] === "npx" &&
      url["terminal"] !== "http://localhost:8448/"
    ) {
      url["terminal"] = "http://localhost:8448/";
      url["app"] = "http://localhost:3000/";
      setTerminal(url["terminal"]);
      setApp(url["app"]);
    }
    setNpx(value);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Typography sx={{ pl: 1, textDecoration: npx ? "line-through" : null }}>
          CodeSandbox
        </Typography>
        <Switch
          checked={npx}
          color="default"
          onChange={(e) => handleSetRuntime(e.target.checked)}
        />
        <Typography
          sx={{ pr: 1, textDecoration: !npx ? "line-through" : null }}
        >
          npx
        </Typography>
      </Box>
      <TextField
        label="Nucleoid Runtime URL"
        disabled={npx ? false : true}
        value={terminal}
        sx={styles.textField}
        onChange={(e) => handleSetTerminal(e.target.value)}
      />
      <TextField
        label="OpenAPI URL"
        disabled={npx ? false : true}
        value={app}
        sx={styles.textField}
        onChange={(e) => handleSetApp(e.target.value)}
      />
    </>
  );
});

export default SettingsDialogUrl;
