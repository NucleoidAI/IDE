import Event from "Event";
import React from "react";

import { useContext } from "Context/providers/contextProvider";
import { useLayoutContext } from "Context/providers/layoutContextProvider";

const ContextMap = () => {
  const [, dispatchLayout] = useLayoutContext();
  const [, dispatchContext] = useContext();

  React.useEffect(() => {
    Event.subscribe("stateChanged", (payload) => {
      switch (payload.type) {
        case "PUSH_ERROR": {
          setTimeout(() => {
            dispatchLayout({ type: "ERROR_MESSAGE" });
          }, 0);
          break;
        }

        case "TEST_CONTEXT": {
          setTimeout(() => {
            dispatchContext({ type: "dispatchContext" });
          }, 0);
          break;
        }

        default:
          break;
      }
    });
  }, [dispatchLayout, dispatchContext]);

  return null;
};

export default ContextMap;
