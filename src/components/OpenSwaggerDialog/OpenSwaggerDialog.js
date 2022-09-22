import OpenSandboxButton from "../../components/OpenSandboxButton";
import OpenSwaggerButton from "../../components/OpenSwaggerButton";
import React from "react";
import Settings from "../../settings";
import { publish, useEvent } from "../../hooks/useEvent";

function OpenSwaggerDialog(props) {
  const { small } = props;
  const event = useEvent("SWAGGER_DIALOG");
  const [runtimeConnection] = useEvent("RUNTIME_CONNECTION", {
    status: false,
    metrics: { free: 50, total: 100 },
  });
  console.debug(event);

  const openSwaggerDialog = () => {
    publish("SWAGGER_DIALOG", { open: true });
  };

  return (
    <>
      {Settings.runtime() === "npx" && (
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
