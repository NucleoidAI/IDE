import React from "react";

const ApiStatusStore = React.createContext();
ApiStatusStore.displayName = "ApiStatusStore";

const useApiStatusStore = () => React.useContext(ApiStatusStore);

const ApiStatusStoreProvider = ({
  children,
  apiStatusInitialState,
  apiStatusReducer,
}) => {
  const [apiStatusState, apiStatusDispatch] = React.useReducer(
    apiStatusReducer,
    apiStatusInitialState
  );

  return (
    <ApiStatusStore.Provider value={[apiStatusState, apiStatusDispatch]}>
      {children}
    </ApiStatusStore.Provider>
  );
};

export { useApiStatusStore, ApiStatusStoreProvider };
