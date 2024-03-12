import ContextProvider from "./context/context";
import EventRegistry from "./EventRegistry";
import GlobalSnackMessage from "./components/GlobalSnackMessage/GlobalSnackMessage";
import Path from "./utils/Path";
import React from "react";
import RouteManager from "./RouteManager";
import Settings from "./settings";
import State from "./state";
import config from "../config";
import { contextReducer } from "./context/reducer";
import { contextToMap } from "./utils/Parser";
import exampleContext from "./lib/context.json";
import http from "./http";
import routes from "./routes";
import { subscribe } from "@nucleoidjs/react-event";
import { useNavigate } from "react-router-dom";
import vfs from "./vfs";

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { darkTheme, lightTheme } from "./theme";
import { storage, useStorage } from "@nucleoidjs/webstorage";

function App() {
  const [context, setContext] = React.useState();
  const navigate = useNavigate();
  const prefersLightMode = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  const [theme] = useStorage(
    "platform",
    "theme",
    prefersLightMode ? "light" : "dark"
  );
  const progressElement = document.getElementById("nuc-progress-indicator");

  function checkMobileSize() {
    return window.innerWidth < 600;
  }

  const elapsed = Date.now() - window.start;
  const delay =
    window.location.hostname === "nucleoid.com" ? 1000 - elapsed : 0;

  React.useEffect(() => {
    subscribe("IDE_LOADING_COMPLETED", () => {
      setTimeout(() => {
        progressElement.classList.add("hidden");
      }, delay);
    });
    const progressElement = document.getElementById("nuc-progress-indicator");
  }, [delay, progressElement]);

  function getContextFromStorage(projectId) {
    const context = storage.get("ide", "projects", projectId);

    const nucContext = State.withPages({ context });
    nucContext.get = (prop) => State.resolve(nucContext, prop);

    return nucContext;
  }

  function project(projectId) {
    return Promise.all([
      http.get(`${config.api}/api/services/${projectId}/context`),
      http.get(`${config.api}/api/services/${projectId}`),
    ]).then(([nucContextResult, serviceResult]) => {
      const context = nucContextResult.data;
      const service = serviceResult.data;
      const nucContext = State.withPages(context);
      nucContext.get = (prop) => State.resolve(nucContext, prop);
      nucContext.nucleoid.project = {
        type: "CLOUD",
        name: service.name,
        id: projectId,
        description: service.description,
      };
      return nucContext;
    });
  }

  function sampleProject() {
    const context = State.withSample();
    context.get = (prop) => State.resolve(context, prop);
    storage.set("ide", "projects", context.nucleoid.project.id, context);

    navigate(`${context.nucleoid.project.id}/api?mode=local`);

    return context;
  }

  const initContext = (context) => {
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

    if (
      !Settings.description() ||
      Settings.description() !== context.nucleoid.project.description
    ) {
      Settings.description(context.nucleoid.project.description);
    }

    if (!Settings.name() || Settings.name !== context.nucleoid.project.name) {
      Settings.name(context.nucleoid.project.name);
    }

    if (!Settings.landing()) {
      Settings.landing({ level: 0 });
    }
    if (checkMobileSize()) {
      navigate("/mobile");
      Settings.plugin(" ");
      Settings.landing({ level: Number.MAX_SAFE_INTEGER });
    }

    return context;
  };

  const initVfs = (context) => {
    const files = contextToMap(context.nucleoid);
    vfs.init(files);
  };
  React.useEffect(() => {
    async function initMode() {
      const mode = Path.getMode();
      const projectId = Path.getProjectId();

      if (mode === "sample") {
        const context = sampleProject();
        initVfs(context);
        return setContext(initContext(context));
      } else if (mode === "cloud") {
        project(projectId).then((result) => {
          initVfs(result);
          return setContext(initContext(result));
        });
      } else if (mode === "chat" || mode === "local") {
        //FOR TESTING
        //storage.set("ide", "projects", "1", JSON.stringify(exampleContext));

        const context = getContextFromStorage(projectId);
        initVfs(context);
        return setContext(initContext(context));
      } else if (mode === "mobile") {
        return setContext("mobile");
      } else {
        navigate("/sample/api");
      }
    }

    initMode();
    // eslint-disable-next-line
  }, [progressElement.classList]);

  if (!context) return null;
  if (context === "error") return "forbidden";

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        <ContextProvider state={context} reducer={contextReducer}>
          <EventRegistry />
          <RouteManager routes={routes} mode={Path.getMode()} />
          <GlobalSnackMessage />
        </ContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
