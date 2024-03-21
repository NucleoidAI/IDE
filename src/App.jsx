import EventRegistry from "./EventRegistry";
import GlobalSnackMessage from "./components/GlobalSnackMessage/GlobalSnackMessage";
import Path from "./utils/Path";
import React from "react";
import RouteManager from "./RouteManager";
import routes from "./routes";
import { subscribe } from "@nucleoidjs/react-event";
import { useStorage } from "@nucleoidjs/webstorage";

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { darkTheme, lightTheme } from "./theme";

function App() {
  const prefersLightMode = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  const [theme] = useStorage(
    "platform",
    "theme",
    prefersLightMode ? "light" : "dark"
  );
  const progressElement = document.getElementById("nuc-progress-indicator");

  const elapsed = Date.now() - window.start;
  const delay =
    window.location.hostname === "nucleoid.com" ? 1000 - elapsed : 0;

  React.useEffect(() => {
    subscribe("CONTAINER_LOADING_COMPLETED", () => {
      setTimeout(() => {
        progressElement.classList.add("hidden");
      }, delay);
    });
    const progressElement = document.getElementById("nuc-progress-indicator");
  }, [delay, progressElement]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        <EventRegistry />
        <RouteManager routes={routes} mode={Path.getMode()} />
        <GlobalSnackMessage />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
