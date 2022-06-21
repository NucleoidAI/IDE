import React from "react";
import styles from "./styles";
import { Box, Switch, TextField, Typography } from "@mui/material";

const SettingsDialogUrl = React.forwardRef((props, urlRef) => {
  const [url, setUrl] = React.useState(urlRef.current.url);
  const [npx, setNpx] = React.useState(
    urlRef.current.runtime === "npx" ? true : false
  );

  const context = urlRef.current;

  React.useEffect(() => {}, []);

  const handleSetUrl = (value) => {
    context["url"] = value;
    setUrl(value);
  };

  const handleSetRuntime = (value) => {
    context["runtime"] = value ? "npx" : "sandbox";

    if (context["runtime"] === "npx" && context["url"] !== "http://localhost") {
      context["url"] = "http://localhost";
      setUrl(context["url"]);
    }
    setNpx(value);
  };

  return (
    <Box sx={{ height: "100%", width: 390 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Typography
          sx={{
            pl: 1,
            textDecoration: npx ? "line-through" : null,
          }}
        >
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
        value={url}
        sx={styles.textField}
        onChange={(e) => handleSetUrl(e.target.value)}
      />
    </Box>
  );
});

export default SettingsDialogUrl;
