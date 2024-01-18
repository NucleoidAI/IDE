import React, { useEffect } from "react";

const ContextStore = React.createContext();
ContextStore.displayName = "ContextStore";

const useContext = () => React.useContext(ContextStore);

const ContextProvider = ({ children, state, reducer }) => {
  const [contextState, contextDispatch] = React.useReducer(reducer, state);

  useEffect(() => {
    try {
      const serializedState = JSON.stringify(contextState);
      localStorage.setItem("contextState", serializedState);
    } catch (error) {
      console.error("Error saving state to local storage:", error);
    }
  }, [contextState]);

  return (
    <ContextStore.Provider value={[contextState, contextDispatch]}>
      {children}
    </ContextStore.Provider>
  );
};

export { useContext };
export default ContextProvider;
