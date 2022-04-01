import React from "react";
import State from "../state";
import { ApiStatusStoreProvider } from "./providers/ApiStatusStoreProvider"; // eslint-disable-line
import { NucleoidStoreProvider } from "./providers/NucleoidStoreProvider";
import { apiStatusReducer } from "./reducers/apiStatusReducer";
import { nucleoidReducer } from "./reducers/nucleoidReducer";

const initStatus = {
  status: "disconnected",
  started: false,
  opened: false,
  metrics: {
    free: 1,
    total: 99,
    animation: 800,
  },
};

const GlobalStoreProvider = ({ children }) => {
  return (
    <NucleoidStoreProvider
      nucleoidInitialState={State.withSample()}
      nucleoidReducer={nucleoidReducer}
    >
      <ApiStatusStoreProvider
        apiStatusInitialState={initStatus}
        apiStatusReducer={apiStatusReducer}
      >
        {children}
      </ApiStatusStoreProvider>
    </NucleoidStoreProvider>
  );
};

export default GlobalStoreProvider;
