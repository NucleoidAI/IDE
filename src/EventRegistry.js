import React from "react";
import { compile } from "./Compiler";
import { subscribe } from "./Event";
//import { useContext } from "Context/providers/contextProvider";

const EventRegistry = () => {
  // const [context] = useContext();

  React.useEffect(() => {
    subscribe("COMPILE_CONTEXT", (payload) => {
      const before = Date.now();
      compile(payload);
      const after = Date.now();
      console.debug(`Compiler took ${after - before}ms`);
    });
  }, []);

  return null;
};

export default EventRegistry;
