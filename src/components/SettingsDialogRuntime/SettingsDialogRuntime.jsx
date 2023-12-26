import React from "react";

import styles from "./styles";

import { Box, Switch, TextField, Typography } from "@mui/material";
import { storage, useStorage } from "@nucleoidjs/webstorage";

const SettingsDialogRuntime = React.forwardRef((props, urlRef) => {
  const [themeStorage] = useStorage("platform", "theme", "light");

  const handleThemeChange = (event) => {
    const newTheme = event.target.checked ? "dark" : "light";
    storage.set("platform.theme", newTheme);
  };

  const [url, setUrl] = React.useState(urlRef.current.url);
  const [custom, setCustom] = React.useState(
    urlRef.current.runtime === "custom" ? true : false
  );

  const context = urlRef.current;

  const handleSetUrl = (value) => {
    context.url = value;
    setUrl(value);
  };

  const handleSetDescription = () => {};

  const handleSetRuntime = (value) => {
    context.runtime = value ? "custom" : "sandbox";

    if (context.runtime === "sandbox") {
      setUrl("https://nucleoid.com/sandbox/");
    }

    if (context.runtime === "custom") {
      context.url = "http://localhost:8448";
      setUrl(context.url);
    }

    setCustom(value);
  };

  return (
    <Box sx={styles.root}>
      <Section title={"Project"}>
        <BetweenComponents title={"Name"}>
          <TextField
            // TODO : get project name
            value={""}
            variant={"standard"}
            size={"small"}
            disabled={true}
            sx={styles.textField}
          />
        </BetweenComponents>
        <Padding />
        <BetweenComponents title={"Description"}>
          <TextField
            InputProps={{ classes: { underline: "red" } }}
            sx={styles.textField}
            // TODO : get project description
            value={""}
            multiline
            row={2}
            variant={"standard"}
            size={"small"}
            disabled={true}
            onChange={(e) => handleSetDescription(e.target.value)}
          />
        </BetweenComponents>
      </Section>
      <Padding />
      <Section title={"Runtime"}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 35,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              fontWeight={!custom ? "bold" : null}
              sx={{
                pl: 1,
                fontSize: !custom ? "16px" : "15px",
                width: 141,
              }}
            >
              Nucleoid Sandbox
            </Typography>
          </Box>
          <Box
            sx={{
              width: "30%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Switch
              checked={custom}
              color="default"
              onChange={(e) => handleSetRuntime(e.target.checked)}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              fontWeight={custom ? "bold" : null}
              sx={{ pr: 1, fontSize: custom ? "16px" : "15px" }}
            >
              Custom
            </Typography>
          </Box>
        </Box>
        <BetweenComponents title={"URL"}>
          <TextField
            size={"small"}
            variant={"standard"}
            disabled={custom ? false : true}
            value={url}
            sx={styles.textField}
            onChange={(e) => handleSetUrl(e.target.value)}
          />
        </BetweenComponents>
      </Section>
      <Section title={"Theme"}>
        <BetweenComponents title={"Dark Mode"}>
          <Switch
            checked={themeStorage !== "light"}
            onChange={handleThemeChange}
          />
        </BetweenComponents>
      </Section>
    </Box>
  );
});

const Padding = () => {
  return <Box sx={{ mb: 1 }}></Box>;
};

const Section = ({ children, title, description }) => {
  return (
    <Box
      sx={{
        // bgcolor: "#232323",
        // border: 2,
        // borderColor: "#282828",
        borderRadius: 2,
      }}
    >
      <Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">{title}</Typography>
          <Typography>{description}</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );
};

const BetweenComponents = ({ children, title }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant={"subtitle2"}>{title}</Typography>
      {children}
    </Box>
  );
};

export default SettingsDialogRuntime;
