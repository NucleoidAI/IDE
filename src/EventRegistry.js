import Event from "Event";
import React from "react";
import vfs from "./vfs";
//import { useContext } from "Context/providers/contextProvider";
//import { useLayoutContext } from "Context/providers/layoutContextProvider";

const EventRegistry = () => {
  // const [, dispatchLayout] = useLayoutContext();
  // const [context] = useContext();

  React.useEffect(() => {
    Event.subscribe("COMPILE_CONTEXT", ({ files }) => {
      const before = Date.now();
      files.forEach((item) => {
        vfs.upsert(item.key, item.value);
      });
      const after = Date.now();
      console.debug(`Compiler took ${after - before}ms`);
    });
  }, []);

  return null;
};

export default EventRegistry;
