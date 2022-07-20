import React from "react";
import Settings from "../settings";
import State from "../state";
import project from "../project";
import service from "../service";

import { ContextProvider } from "./providers/contextProvider"; // eslint-disable-line
import { LayoutContextProvider } from "./providers/layoutContextProvider";
import { contextReducer } from "./reducers/contextReducer";
import { layoutReducer } from "./reducers/layoutReducer";

const initStatus = {
  status: "unreachable",
  sandbox: Settings.codesandbox.sandboxID() ? true : false,
  sandboxDialog: false,
  metrics: {
    free: 50,
    total: 100,
    animation: 800,
  },
};

const InitContext = () => {
  if (!Settings.beta()) {
    Settings.beta(false);
  }

  /*
  if (!Settings.runtime()) {
    Settings.runtime("sandbox");
  }
*/
  if (!Settings.url.app()) {
    Settings.url.app("http://localhost:3000/");
  }

  if (!Settings.url.terminal()) {
    Settings.url.terminal("http://localhost:8448/");
  }

  if (!Settings.landing()) {
    Settings.landing({ level: 0 });
  }

  if (project.isAuth()) {
    service.getProjects().then(({ data }) => {
      Settings.projects = [...data];
    });
  }

  if (project.check()) {
    const { context } = project.get();

    context.get = (prop) => State.resolve(context, prop);
    return context;
  } else {
    project.setDemo();
    const { context } = project.get();

    context.get = (prop) => State.resolve(context, prop);
    return context;
  }
};

const GlobalStoreProvider = ({ children }) => {
  return (
    <ContextProvider state={InitContext()} reducer={contextReducer}>
      <LayoutContextProvider state={initStatus} reducer={layoutReducer}>
        {children}
      </LayoutContextProvider>
    </ContextProvider>
  );
};

export default GlobalStoreProvider;
