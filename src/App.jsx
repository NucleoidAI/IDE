import AppSnackMessage from "./components/AppSnackMessage/AppSnackMessage";
import EventRegistry from "./EventRegistry";
import GraphDialog from "./components/GraphDialog/GraphDialog";
import Path from "./utils/Path";
import RouteManager from "./RouteManager";
import Settings from "./settings";
import routes from "./routes";
import { useStorage } from "@nucleoidjs/webstorage";

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect } from "react";
import { darkTheme, lightTheme } from "./theme";
import { publish, subscribe, useEvent } from "@nucleoidai/react-event";

window["@nucleoidai"] = {
  Event: { publish, subscribe, useEvent },
};

let loaded = false;

function App() {
  const [event] = useEvent("CONTAINER_LOADED", { name: "" });
  const prefersLightMode = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  const [theme] = useStorage(
    "platform",
    "theme",
    prefersLightMode ? "light" : "dark"
  );

  const elapsed = Date.now() - window.start;
  const delay =
    window.location.hostname === "nucleoid.com" ? 1000 - elapsed : 0;

  function initSettings() {
    if (!Settings.beta()) {
      Settings.beta(false);
    }

    if (!Settings.debug()) {
      Settings.debug(false);
    }

    if (!Settings.url.app()) {
      Settings.url.app("http://localhost:3000");
    }

    if (!Settings.url.terminal()) {
      Settings.url.terminal("http://localhost:8448");
    }

    if (!Settings.runtime()) {
      Settings.runtime("sandbox");
    }
  }

  useEffect(() => {
    initSettings();
    loaded = false;
  }, []);

  useEffect(() => {
    if (event.name && !loaded) {
      setTimeout(() => {
        progressElement.classList.add("hidden");
        loaded = true;
      }, delay);
      const progressElement = document.getElementById("nuc-progress-indicator");
    }
    // eslint-disable-next-line
  }, [event.name]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        <EventRegistry />
        <RouteManager routes={routes} mode={Path.getMode()} />
        <AppSnackMessage />
        <GraphDialog />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
