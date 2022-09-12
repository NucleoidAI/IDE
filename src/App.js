import API from "./pages/ide/API";
import Dashboard from "./pages/ide/Dashboard";
import Dev from "./pages/Dev";
import EventRegistry from "./EventRegistry";
import Functions from "./pages/ide/Functions";
import GlobalStoreProvider from "./Context/GlobalStoreProvider";
import IDE from "./layouts/IDE";
import Login from "./pages/ide/login";
import Logs from "./pages/ide/Logs";
import Query from "./pages/ide/Query";
import React from "react";
import Settings from "./settings";
import theme from "./theme";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";

function App() {
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

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStoreProvider>
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
                <Route path={"/api"} element={<API />} />
                <Route path={"/functions"} element={<Functions />} />
                <Route path={"/query"} element={<Query />} />
                <Route path={"/logs"} element={<Logs />} />
              </Route>
              <Route path={"/dev"} element={<Dev />} />
              <Route path={"/login"} element={<Login />} />
            </Routes>
          </BrowserRouter>
        </GlobalStoreProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
