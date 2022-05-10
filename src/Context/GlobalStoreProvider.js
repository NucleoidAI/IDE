import React from "react";
import Settings from "../settings";
import State from "../state";
import { ContextProvider } from "./providers/contextProvider"; // eslint-disable-line
import { LayoutContextProvider } from "./providers/layoutContextProvider";
import { contextReducer } from "./reducers/contextReducer";
import { layoutReducer } from "./reducers/layoutReducer";

const initStatus = {
  status: "unreachable",
  openApi: false,
  metrics: {
    free: 50,
    total: 100,
    animation: 800,
  },
};

const ProjectManager = () => {
  Settings.project = localStorage.default;

  if (!Settings.project) {
    localStorage.setItem("default", "project#default");
    Settings.project = "project#default";

    return State.withSample();
  }

  if (
    Object.keys(localStorage).filter(
      (item) => item.split("#")[0] === "project" && item === Settings.project
    ).length < 1
  ) {
    localStorage.setItem("default", "project#default");
    Settings.project = "project#default";

    return State.withSample();
  }

  const state = JSON.parse(localStorage.getItem(Settings.project));
  state.get = (prop) => State.resolve(state, prop);

  return state;
};

const GlobalStoreProvider = ({ children }) => {
  return (
    <ContextProvider state={ProjectManager()} reducer={contextReducer}>
      <LayoutContextProvider state={initStatus} reducer={layoutReducer}>
        {children}
      </LayoutContextProvider>
    </ContextProvider>
  );
};

export default GlobalStoreProvider;
