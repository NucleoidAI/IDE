import React from "react";
import State from "../state";
import { ContextProvider } from "./providers/contextProvider";// eslint-disable-line
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

const GlobalStoreProvider = ({ children }) => {
  return (
    <ContextProvider state={State.withSample()} reducer={contextReducer}>
      <LayoutContextProvider state={initStatus} reducer={layoutReducer}>
        {children}
      </LayoutContextProvider>
    </ContextProvider>
  );
};

export default GlobalStoreProvider;
