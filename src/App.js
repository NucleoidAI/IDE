import API from "./pages/ide/API";
import Branches from "./pages/ide/Branches";
import Dev from "./pages/Dev";
import Functions from "./pages/ide/Functions";
import IDE from "./layouts/IDE";
import Logs from "./pages/ide/Logs";
import Query from "./pages/ide/Query";
import State from "./state";
import theme from "./theme";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { StoreProvider } from "./store"; // eslint-disable-line
import { reducer } from "./context";

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StoreProvider initialState={State.withSample()} reducer={reducer}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IDE />}>
                <Route index element={<Navigate to="/ide/api" />} />
                <Route path="/ide/api" element={<API />} />
                <Route path={"/ide/functions"} element={<Functions />} />
                <Route path={"/ide/query"} element={<Query />} />
                <Route path={"/ide/branches"} element={<Branches />} />
                <Route path={"/ide/logs"} element={<Logs />} />
                <Route path={"/dev"} element={<Dev />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </StoreProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
