import Event from "Event";
import React from "react";
import Settings from "./settings";
import vfs from "./vfs";
//import { useContext } from "Context/providers/contextProvider";
//import { useLayoutContext } from "Context/providers/layoutContextProvider";

const EventRegistry = () => {
  // const [, dispatchLayout] = useLayoutContext();
  // const [context] = useContext();

  React.useEffect(() => {
    Event.subscribe("CONTEXT_CHANGED", ({ files }) => {
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
