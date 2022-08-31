import Event from "Event";
import React from "react";
import { compile } from "Compiler";
//import { useContext } from "Context/providers/contextProvider";
//import { useLayoutContext } from "Context/providers/layoutContextProvider";

const EventProvider = () => {
  // const [, dispatchLayout] = useLayoutContext();
  // const [context] = useContext();

  React.useEffect(() => {
    Event.subscribe("COMPILE_CONTEXT", (payload) => {
      const before = Date.now();
      compile(payload);
      const after = Date.now();
      console.debug(`Compiler took ${after - before}ms`);
    });
  }, []);

  return null;
};

export default EventProvider;
