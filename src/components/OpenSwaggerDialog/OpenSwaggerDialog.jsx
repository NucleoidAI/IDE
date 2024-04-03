import OpenSandboxButton from "../OpenSandboxButton";
import OpenSwaggerButton from "../OpenSwaggerButton";
import React from "react";
import Settings from "../../settings";
import { publish, useEvent } from "@nucleoidai/react-event";

function OpenSwaggerDialog(props) {
  const { small } = props;
  const [runtimeConnection] = useEvent("RUNTIME_CONNECTION", {
    status: false,
    metrics: { free: 50, total: 100 },
  });

  const openSwaggerDialog = () => {
    publish("SWAGGER_DIALOG", { open: true });
  };

  return (
    <>
      {Settings.runtime() === "custom" && (
        <OpenSwaggerButton
          disabled={!runtimeConnection.status}
          clickEvent={openSwaggerDialog}
          small={small}
        />
      )}
      {Settings.runtime() === "sandbox" && (
        <OpenSandboxButton
          disabled={!runtimeConnection.status}
          clickEvent={openSwaggerDialog}
          small={small}
        />
      )}
    </>
  );
}

export default OpenSwaggerDialog;
