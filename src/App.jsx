import ContextProvider from "./context/context";
import EventRegistry from "./EventRegistry";
import IDE from "./containers/IDE"; // eslint-disable-line
import React from "react";
import Settings from "./settings";
import State from "./state";
import axios from "axios";
import { contextReducer } from "./context/reducer";
import { contextToMap } from "./utils/Parser";
import routes from "./routes";
import { subscribe } from "@nucleoidjs/react-event";
import { useStorage } from "@nucleoidjs/webstorage";
import vfs from "./vfs";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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

  function checkMobileSize() {
    return window.innerWidth < 600 ? true : false;
  }

  const elapsed = Date.now() - window.start;
  const delay =
    window.location.hostname === "nucleoid.com" ? 1000 - elapsed : 0;

  React.useEffect(() => {
    subscribe("EDITOR_LOADING_COMPLETED", () => {
      setTimeout(() => {
        progressElement.classList.add("hidden");
      }, delay);
    });
    const progressElement = document.getElementById("nuc-progress-indicator");
  }, [delay, progressElement]);

  function project(id) {
    return Promise.all([
      axios.get(`http://localhost:3001/api/services/${id}/context`),
      axios.get(`http://localhost:3001/api/services/${id}`),
    ]).then(([contextResult, serviceResult]) => {
      const context = contextResult.data.context;
      const service = serviceResult.data;
      context.get = (prop) => State.resolve(context, prop);
      context.nucleoid.project = {
        name: service.name,
        id: id,
        description: service.description,
      };
      return context;
    });
  }
  const InitVfs = (context) => {
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
      Settings.plugin(" ");
      Settings.landing({ level: 4 });
    }

    const files = contextToMap(context.nucleoid);
    vfs.init(files);

    return context;
  };

  const [context, setContext] = React.useState();

  React.useEffect(() => {
    async function initContext() {
      const id = window.location.pathname.split("/")[2];

      let context;
      try {
        const serializedState = localStorage.getItem("contextState");
        if (serializedState) {
          context = JSON.parse(serializedState);
          context.get = (prop) => State.resolve(context, prop);
          return setContext(InitVfs(context));
        }
      } catch (error) {
        console.error("Error loading state from local storage:", error);
      }

      if (!context) {
        if (id === "sample") {
          context = State.withSample();
          context.get = (prop) => State.resolve(context, prop);
          context.nucleoid.project = {
            name: "Sample",
            id: "Sample",
            description:
              "Nucleoid low-code framework lets you build your APIs with the help of AI and built-in datastore",
          };
          return setContext(InitVfs(context));
        }

        if (id) {
          project(id)
            .then((result) => {
              return setContext(InitVfs(result));
            })
            .catch(() => {
              progressElement.classList.add("hidden");

              return setContext("error");
            });
        } else {
          window.location.assign(`${window.location.href}/sample/api`);
        }
      }
    }

    initContext();
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
            <Routes>
              <Route path="/" element={<IDE />}>
                <Route index element={<Navigate to="/sample/api" />} />
                {routes.map((route) => (
                  <Route
                    path={route.path}
                    key={route.link}
                    element={route.element}
                  />
                ))}
              </Route>
              <Route path={"/graph"} />
              <Route path={"*"} element={<Navigate to="/" />} />
            </Routes>
          </ContextProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
