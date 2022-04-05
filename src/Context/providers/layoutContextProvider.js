import React from "react";

const LayoutStore = React.createContext();
LayoutStore.displayName = "LayoutStore";

const useLayoutContext = () => React.useContext(LayoutStore);

const LayoutContextProvider = ({ children, state, reducer }) => {
  const [layoutContextState, layoutContextDispatch] = React.useReducer(
    reducer,
    state
  );

  return (
    <LayoutStore.Provider value={[layoutContextState, layoutContextDispatch]}>
      {children}
    </LayoutStore.Provider>
  );
};

export { useLayoutContext, LayoutContextProvider };
