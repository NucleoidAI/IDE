import React from "react";

const Store = React.createContext();
Store.displayName = "Store";

const useStore = () => React.useContext(Store);

const StoreProvider = ({ children, initialState, reducer }) => {
  const [globalState, dispatch] = React.useReducer(reducer, initialState);

  return (
    <Store.Provider value={[globalState, dispatch]}>{children}</Store.Provider>
  );
};

export { useStore, StoreProvider };
