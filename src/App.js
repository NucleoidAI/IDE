import API from "./pages/ide/API";
import Dev from "./pages/Dev";
import Functions from "./pages/ide/Functions";
import GlobalStoreProvider from "./Context/GlobalStoreProvider";
import IDE from "./layouts/IDE";
import Login from "./pages/ide/login";
import Logs from "./pages/ide/Logs";
import Query from "./pages/ide/Query";
import theme from "./theme";


import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStoreProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IDE />}>
                <Route index element={<Navigate to="/ide/api" />} />
                <Route path="/ide/api" element={<API />} />
                <Route path={"/ide/functions"} element={<Functions />} />
                <Route path={"/ide/query"} element={<Query />} />
                <Route path={"/ide/logs"} element={<Logs />} />
                <Route path={"/dev"} element={<Dev />} />
                <Route path={"/login"} element={<Login />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </GlobalStoreProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
