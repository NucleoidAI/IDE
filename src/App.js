import API from "./pages/ide/API";
import Branches from "./pages/ide/Branches";
import Dev from "./pages/Dev";
import Functions from "./pages/ide/Functions";
import IDE from "./layouts/IDE";
import Logs from "./pages/ide/Logs";
import Query from "./pages/ide/Query";
import State from "./state";
import theme from "./theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Context, reducer } from "./context";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import React, { useReducer } from "react";

function App() {
  const [state, dispatch] = useReducer(reducer, State.withSample());

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Context.Provider value={[state, dispatch]}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IDE />}>
                <Route index element={<API />} />
                <Route path={"/dev"} element={<Dev />} />
                {/* }<Route path={"/ide/api"} element={<API />} /> {*/}
                <Route path={"/ide/functions"} element={<Functions />} />
                <Route path={"/ide/query"} element={<Query />} />
                <Route path={"/ide/branches"} element={<Branches />} />
                <Route path={"/ide/logs"} element={<Logs />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Context.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
