import React from "react";

const LayoutStore = React.createContext();
LayoutStore.displayName = "ApiStatusStore";

const useApiStatusStore = () => React.useContext(LayoutStore);

const LayoutStoreProvider = ({
  children,
  apiStatusInitialState,
  layoutReducer,
}) => {
  const [apiStatusState, apiStatusDispatch] = React.useReducer(
    layoutReducer,
    apiStatusInitialState
  );

  return (
    <LayoutStore.Provider value={[apiStatusState, apiStatusDispatch]}>
      {children}
    </LayoutStore.Provider>
  );
};

export { useApiStatusStore, LayoutStoreProvider };
