import React from "react";
import { subscribe } from "@nucleoidai/react-event";
import vfs from "./vfs";
//import { useContext } from "Context/context";
import Settings from "./settings"; //eslint-disable-line
const EventRegistry = () => {
  // const [context] = useContext();

  React.useEffect(() => {
    subscribe("CONTEXT_CHANGED", ({ files }) => {
      if (Settings.debug()) {
        const list = [];
        vfs.fsMap.forEach((value, key) => {
          list.push({ key: key, value: value });
        });
        console.log(list);
      }

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
