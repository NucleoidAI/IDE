import React from "react";
import Settings from "./settings";
import { subscribe } from "./Event";
import vfs from "./vfs";

//import { useContext } from "Context/providers/contextProvider";

const EventRegistry = () => {
  // const [context] = useContext();

  React.useEffect(() => {
    subscribe("CONTEXT_CHANGED", ({ files }) => {
      if (Settings.beta()) {
        files.forEach((item) => {
          vfs.upsert(item.key, item.value);
        });
      }
    });
  }, []);

  return null;
};

export default EventRegistry;
