import { Outlet } from "react-router-dom";

import React, { useEffect } from "react";
import { publish, useEvent } from "@nucleoidai/react-event";

function Blank() {
  const [event] = useEvent("PAGE_LOADED", {
    name: null,
  });

  useEffect(() => {
    if (event.name) {
      publish("CONTAINER_LOADED", { name: "Blank" });
    }
  }, [event.name]);

  return <Outlet />;
}
export default Blank;
