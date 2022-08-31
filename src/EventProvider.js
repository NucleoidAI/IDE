import { compile } from "Compiler";
import Event from "Event";
import React from "react";
import { useContext } from "Context/providers/contextProvider";
import { useLayoutContext } from "Context/providers/layoutContextProvider";

const EventProvider = () => {
  const [, dispatchLayout] = useLayoutContext();
  const [context] = useContext();

  React.useEffect(() => {
    Event.subscribe("COMPILE_CONTEXT", (payload) => {
      const before = Date.now();
      compile(context, payload.files);
      const after = Date.now();
      console.debug(`Compiler took ${after - before}ms`);
    });
    // eslint-disable-next-line
  }, []);

  return null;
};

export default EventProvider;
