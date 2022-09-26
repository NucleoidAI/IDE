import React from "react";
import Settings from "../settings";
import State from "../state";
import { contextReducer } from "./reducers/contextReducer";
import { contextToMap } from "../utils/Parser";
import project from "../project";
import service from "../service";
import vfs from "../vfs";

const ContextStore = React.createContext();
ContextStore.displayName = "ContextStore";

const useContext = () => React.useContext(ContextStore);

const InitContext = () => {
  if (!Settings.beta()) {
    Settings.beta(false);
  }

  if (!Settings.debug()) {
    Settings.debug(false);
  }

  if (!Settings.url.app()) {
    Settings.url.app("http://localhost:3000/");
  }

  if (!Settings.url.terminal()) {
    Settings.url.terminal("http://localhost:8448/");
  }

  if (!Settings.runtime()) {
    Settings.runtime("sandbox");
  }

  if (!Settings.description()) {
    Settings.description(
      "Nucleoid low-code framework lets you build your APIs with the help of AI and built-in datastore"
    );
  }

  if (!Settings.landing()) {
    Settings.landing({ level: 0 });
  }

  if (project.isAuth()) {
    service.getProjects().then(({ data }) => {
      Settings.projects = [...data];
    });
  }

  let context;

  if (project.check()) {
    context = project.get().context;
    context.get = (prop) => State.resolve(context, prop);
  } else {
    project.setDemo();
    context = project.get().context;
    context.get = (prop) => State.resolve(context, prop);
  }

  if (Settings.beta()) {
    const files = contextToMap(context.nucleoid);
    vfs.init(files);
  }
  return context;
};

const ContextProvider = ({ children }) => {
  const [contextState, contextDispatch] = React.useReducer(
    contextReducer,
    InitContext()
  );

  return (
    <ContextStore.Provider value={[contextState, contextDispatch]}>
      {children}
    </ContextStore.Provider>
  );
};

export { useContext };
export default ContextProvider;
