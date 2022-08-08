import Compile from "compile";
import Event from "Event";
import React from "react";

import { useContext } from "Context/providers/contextProvider";
import { useLayoutContext } from "Context/providers/layoutContextProvider";

const ContextMap = () => {
  const [, dispatchLayout] = useLayoutContext();
  const [context] = useContext();

  React.useEffect(() => {
    Event.subscribe("stateChanged", (payload) => {
      switch (payload.type) {
        case "PUSH_ERROR": {
          dispatchLayout({ type: "ERROR_MESSAGE" });
          break;
        }

        case "COMPILE_CONTEXT": {
          Compile(context);
          break;
        }

        default:
          break;
      }
    });

    //eslint-disable-next-line
  }, []);

  return null;
};

export default ContextMap;
