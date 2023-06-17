import ContextProvider from "./context/context";
import EventRegistry from "./EventRegistry";
import React from "react";
import Settings from "./settings";
import State from "./state";
import { contextReducer } from "./context/reducer";
import { contextToMap } from "./utils/Parser";
import project from "./project";
import routes from "./routes";
import service from "./service";
import { subscribe } from "@nucleoidjs/synapses";
import theme from "./theme";
import vfs from "./vfs";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";

import IDE from "./layouts/IDE"; // eslint-disable-line

function App() {
  function checkMobileSize() {
    return window.innerWidth < 600 ? true : false;
  }

  const elapsed = Date.now() - window.start;
  const delay =
    window.location.hostname === "nucleoid.com" ? 1000 - elapsed : 0;

  React.useEffect(() => {
    const progressElement = document.getElementById("nuc-progress-indicator");

    subscribe("EDITOR_LOADING_COMPLETED", () => {
      setTimeout(() => {
        progressElement.classList.add("hidden");
      }, delay);
    });
  }, [delay]);

  const InitContext = () => {
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

    if (!Settings.description()) {
      Settings.description(
        "Nucleoid low-code framework lets you build your APIs with the help of AI and built-in datastore"
      );
    }

    if (!Settings.landing()) {
      Settings.landing({ level: 0 });
    }
    if (checkMobileSize()) {
      Settings.plugin(" ");
      Settings.landing({ level: 4 });
    }

    if (project.isAuth()) {
      service.getProjects().then(({ data }) => {
        Settings.projects = [...data];
      });
    }

    const context = State.withSample();
    context.get = (prop) => State.resolve(context, prop);

    const files = contextToMap(context.nucleoid);
    vfs.init(files);

    return context;
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ContextProvider state={InitContext()} reducer={contextReducer}>
          <BrowserRouter basename="ide">
            <EventRegistry />
            <Routes>
              <Route path="/" element={<IDE />}>
                <Route index element={<Navigate to="/sample/api" />} />
                {routes.map((route) => (
                  <Route
                    path={route.path}
                    element={route.element}
                    key={route.link}
                  />
                ))}
              </Route>
              <Route path={"*"} element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </ContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
