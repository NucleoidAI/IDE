import React from "react";
import State from "../state";
import { ApiStatusStoreProvider } from "./providers/ApiStatusStoreProvider";// eslint-disable-line
import { NucleoidStoreProvider } from "./providers/NucleoidStoreProvider";
import { apiStatusReducer } from "./reducers/apiStatusReducer";
import { nucleoidReducer } from "./reducers/nucleoidReducer";

const GlobalStoreProvider = ({ children }) => {
  return (
    <NucleoidStoreProvider
      nucleoidInitialState={State.withSample()}
      nucleoidReducer={nucleoidReducer}
    >
      <ApiStatusStoreProvider
        apiStatusInitialState={{ name: "" }}
        apiStatusReducer={apiStatusReducer}
      >
        {children}
      </ApiStatusStoreProvider>
    </NucleoidStoreProvider>
  );
};

export default GlobalStoreProvider;
