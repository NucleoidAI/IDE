import React from "react";

const NucleoidStore = React.createContext();
NucleoidStore.displayName = "NucleoidStore";

const useNucleoidStore = () => React.useContext(NucleoidStore);

const NucleoidStoreProvider = ({
  children,
  nucleoidInitialState,
  nucleoidReducer,
}) => {
  const [nucleoidState, nucleoidDispatch] = React.useReducer(
    nucleoidReducer,
    nucleoidInitialState
  );

  return (
    <NucleoidStore.Provider value={[nucleoidState, nucleoidDispatch]}>
      {children}
    </NucleoidStore.Provider>
  );
};

export { useNucleoidStore, NucleoidStoreProvider };
