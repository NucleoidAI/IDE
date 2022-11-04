import API from "./pages/ide/API";
import BusinessFlow from "./pages/ide/BusinessFlow";
import ContextProvider from "./context/context";
import Dashboard from "./pages/ide/Dashboard";
import Dev from "./pages/Dev";
import EventRegistry from "./EventRegistry";
import Functions from "./pages/ide/Functions";
import IDE from "./layouts/IDE";
import Login from "./pages/ide/login";
import Logs from "./pages/ide/Logs";
import Query from "./pages/ide/Query";
import React from "react";
import Settings from "./settings";
import State from "./state";
import { contextReducer } from "./context/reducer";
import { contextToMap } from "./utils/Parser";
import project from "./project";
import service from "./service";
import theme from "./theme";
import vfs from "./vfs";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";

function App() {
  function checkMobileSize() {
    return window.innerWidth < 600 ? true : false;
  }

  React.useEffect(() => {
    const elapsed = Date.now() - window.start;
    const delay =
      window.location.hostname === "nucleoid.com" ? 2000 - elapsed : 0;

    setTimeout(() => {
      const progressElement = document.getElementById("nuc-progress-indicator");
      if (progressElement) {
        progressElement.classList.add("available");
      }
    }, delay);
  }, []);

  const InitContext = () => {
    if (!Settings.beta()) {
      Settings.beta(false);
    }

    if (!Settings.debug()) {
      Settings.debug(false);
    }

    if (!Settings.url.app()) {
      Settings.url.app("http://localhost:3000/");
    }

    if (!Settings.url.terminal()) {
      Settings.url.terminal("http://localhost:8448/");
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
      Settings.landing({ level: 4 });
    }

    if (project.isAuth()) {
      service.getProjects().then(({ data }) => {
        Settings.projects = [...data];
      });
    }

    let context;

    if (project.check()) {
      context = project.get().context;
      context.get = (prop) => State.resolve(context, prop);
    } else {
      project.setDemo();
      context = project.get().context;
      context.get = (prop) => State.resolve(context, prop);
    }

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
                {Settings.plugin() ? (
                  <Route index element={<Navigate to="/dashboard" />} />
                ) : (
                  <Route index element={<Navigate to="/api" />} />
                )}
                <Route path={"/dashboard"} element={<Dashboard />} />
                <Route path={"/businessflow"} element={<BusinessFlow />} />
                <Route path={"/api"} element={<API />} />
                <Route path={"/functions"} element={<Functions />} />
                <Route path={"/query"} element={<Query />} />
                <Route path={"/logs"} element={<Logs />} />
              </Route>
              <Route path={"/dev"} element={<Dev />} />
              <Route path={"/login"} element={<Login />} />
            </Routes>
          </BrowserRouter>
        </ContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
