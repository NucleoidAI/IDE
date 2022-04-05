import React from "react";
import State from "../state";
import { LayoutStoreProvider } from "./providers/ApiStatusStoreProvider"; // eslint-disable-line
import { NucleoidStoreProvider } from "./providers/NucleoidStoreProvider";
import { layoutReducer } from "./reducers/layoutReducer";
import { nucleoidReducer } from "./reducers/nucleoidReducer";

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
    <NucleoidStoreProvider
      nucleoidInitialState={State.withSample()}
      nucleoidReducer={nucleoidReducer}
    >
      <LayoutStoreProvider
        apiStatusInitialState={initStatus}
        layoutReducer={layoutReducer}
      >
        {children}
      </LayoutStoreProvider>
    </NucleoidStoreProvider>
  );
};

export default GlobalStoreProvider;
