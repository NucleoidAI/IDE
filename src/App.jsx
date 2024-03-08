import { BrowserRouter } from "react-router-dom";
import ContextProvider from "./context/context";
import EventRegistry from "./EventRegistry";
import IDE from "./containers/IDE"; // eslint-disable-line
import Path from "./utils/Path";
import React from "react";
import RouteManager from "./RouteManager";
import Settings from "./settings";
import State from "./state";
import config from "../config";
import { contextReducer } from "./context/reducer";
import { contextToMap } from "./utils/Parser";
import routes from "./routes";
import { subscribe } from "@nucleoidjs/react-event";
import { useStorage } from "@nucleoidjs/webstorage";
import vfs from "./vfs";

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { darkTheme, lightTheme } from "./theme";

function App() {
  const [context, setContext] = React.useState();

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
    return window.innerWidth < 600 ? true : false;
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

  function project(id) {
    return Promise.all([
      axios.get(`${config.api}/api/services/${id}/context`),
      axios.get(`${config.api}/api/services/${id}`),
    ]).then(([nucContextResult, serviceResult]) => {
      const context = nucContextResult.data;
      const service = serviceResult.data;
      const nucContext = State.withPages(context);
      nucContext.get = (prop) => State.resolve(nucContext, prop);
      nucContext.nucleoid.project = {
        name: service.name,
        id: id,
        description: service.description,
      };
      return nucContext;
    });
  }

  function sampleProject() {
    const context = State.withSample();
    context.get = (prop) => State.resolve(context, prop);
    context.nucleoid.project = {
      name: "Sample",
      id: "Sample",
      description:
        "Nucleoid low-code framework lets you build your APIs with the help of AI and built-in datastore",
    };
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
      window.location.assign(`${window.location.origin}/ide/mobile`);
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
      const id = window.location.pathname.split("/")[2];
      const mode = Path.getMode();

      if (mode === "sample") {
        const context = sampleProject();
        initVfs(context);
        return setContext(initContext(context));
      }
      if (mode === "cloud") {
        project(id).then((result) => {
          initVfs(result);
          return setContext(initContext(result));
        });
      }
      if (mode === "chat") {
        const context = sampleProject();
        initVfs(context);
        return setContext(initContext(context));
      }
      if (mode === "mobile") {
        return setContext("mobile");
      } else {
        window.location.assign(`${window.location.origin}/ide/sample/api`);
      }
    }

    initMode();
    // eslint-disable-next-line
  }, [progressElement.classList]);

  React.useEffect(() => {}, []);

  if (!context) return null;
  if (context === "error") return "forbidden";

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        <BrowserRouter basename="ide">
          <ContextProvider state={context} reducer={contextReducer}>
            <EventRegistry />
            <RouteManager routes={routes} mode={Path.getMode()} />
          </ContextProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
