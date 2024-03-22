import EventRegistry from "./EventRegistry";
import GlobalSnackMessage from "./components/GlobalSnackMessage/GlobalSnackMessage";
import Path from "./utils/Path";
import React from "react";
import RouteManager from "./RouteManager";
import routes from "./routes";
import { useEvent } from "@nucleoidai/react-event";
import { useStorage } from "@nucleoidjs/webstorage";

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { darkTheme, lightTheme } from "./theme";

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

  React.useEffect(() => {
    if (event.name) {
      setTimeout(() => {
        progressElement.classList.add("hidden");
      }, delay);

      const progressElement = document.getElementById("nuc-progress-indicator");
    }
  }, [event.name]);

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
