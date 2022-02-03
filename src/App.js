import API from "./pages/ide/API";
import Branches from "./pages/ide/Branches";
import Dev from "./pages/Dev";
import Functions from "./pages/ide/Functions";
import Logs from "./pages/ide/Logs";
import Query from "./pages/ide/Query";
import State from "./state";
import theme from "./theme";
import { Context, reducer } from "./context";
import {
  CssBaseline,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material";
import React, { useReducer } from "react";
import { Redirect, Route, BrowserRouter as Router } from "react-router-dom";

function App() {
  const [state, dispatch] = useReducer(reducer, State.withSample());

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Context.Provider value={[state, dispatch]}>
          <Router>
            <Route exact path="/" render={() => <Redirect to="/ide/api" />} />
            <Route path={["/dev"]} component={Dev} />
            <Route path={"/ide/api"} component={API} />
            <Route path={"/ide/functions"} component={Functions} />
            <Route path={"/ide/query"} component={Query} />
            <Route path={"/ide/branches"} component={Branches} />
            <Route path={"/ide/logs"} component={Logs} />
          </Router>
        </Context.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
