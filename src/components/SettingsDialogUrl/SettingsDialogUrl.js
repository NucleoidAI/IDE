import React from "react";
import styles from "./styles";
import { Box, Switch, TextField, Typography } from "@mui/material";

const SettingsDialogUrl = React.forwardRef((props, urlRef) => {
  const [url, setUrl] = React.useState(urlRef.current.url);
  const [npx, setNpx] = React.useState(
    urlRef.current.runtime === "npx" ? true : false
  );

  const context = urlRef.current;

  const handleSetUrl = (value) => {
    context["url"] = value;
    setUrl(value);
  };

  const handleSetRuntime = (value) => {
    context["runtime"] = value ? "npx" : "sandbox";

    if (
      context["runtime"] === "npx" &&
      context["url"] !== "http://localhost:8448/"
    ) {
      context["url"] = "http://localhost:8448/";
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
          height: 35,
        }}
      >
        <Typography
          fontWeight={!npx ? "bold" : null}
          sx={{
            pl: 1,
            fontSize: !npx ? "16px" : "15px",
            width: 108,
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
          fontWeight={npx ? "bold" : null}
          sx={{ pr: 1, fontSize: npx ? "16px" : "15px" }}
        >
          npx
        </Typography>
      </Box>
      <TextField
        label="Runtime"
        disabled={npx ? false : true}
        value={url}
        sx={styles.textField}
        onChange={(e) => handleSetUrl(e.target.value)}
      />
    </Box>
  );
});

export default SettingsDialogUrl;
