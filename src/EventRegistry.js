import React from "react";
import { subscribe } from "@nucleoidjs/synapses";
import vfs from "./vfs";
//import { useContext } from "Context/context";

const EventRegistry = () => {
  // const [context] = useContext();

  React.useEffect(() => {
    subscribe("CONTEXT_CHANGED", ({ files }) => {
      files.forEach((item) => {
        vfs.upsert(item.key, item.value);
      });
    });
  }, []);

  return null;
};

export default EventRegistry;
