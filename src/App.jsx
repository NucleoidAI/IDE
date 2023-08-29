import ContextProvider from "./context/context";
import EventRegistry from "./EventRegistry";
import IDE from "./layouts/IDE"; // eslint-disable-line
import React from "react";
import Settings from "./settings";
import State from "./state";
import { contextReducer } from "./context/reducer";
import { contextToMap } from "./utils/Parser";
import routes from "./routes";
import { subscribe } from "@nucleoidjs/synapses";
import theme from "./theme";
import vfs from "./vfs";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";

function App() {
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
    return new Promise((resolve, reject) => {
      // TODO : replace service call
      setTimeout(() => {
        if (id === "2643bf5a-b03a-4eee-93f5-68bd5103beb0") {
          const context = State.withSample();
          context.get = (prop) => State.resolve(context, prop);
          context.nucleoid.project = {
            name: "Test-Project",
            description:
              "Nucleoid low-code framework lets you build your APIs with the help of AI and built-in datastore",
            id: "2643bf5a-b03a-4eee-93f5-68bd5103beb0",
          };
          resolve(context);
        }

        reject("error");
      }, 3000);
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

    if (!Settings.description()) {
      Settings.description(context.nucleoid.project.description);
    }

    if (!Settings.name()) {
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

    initContext();
    // eslint-disable-next-line
  }, [progressElement.classList]);

  if (!context) return null;
  if (context === "error") return "forbidden";

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
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
