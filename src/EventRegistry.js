import React from "react";
import { subscribe } from "@nucleoidjs/synapses";
import vfs from "./vfs";
//import { useContext } from "Context/context";

const EventRegistry = () => {
  // const [context] = useContext();

  React.useEffect(() => {
    subscribe("CONTEXT_CHANGED", ({ files }) => {
      //  console.log("CONTEXT_CHANGED", vfs);
      files.forEach(({ key, value }) => {
        if (value) {
          vfs.upsert(key, value);
        } else {
          vfs.remove(key);
        }
      });
    });
  }, []);

  return null;
};

export default EventRegistry;
