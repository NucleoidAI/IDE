import OpenSandboxButton from "../../components/OpenSandboxButton";
import OpenSwaggerButton from "../../components/OpenSwaggerButton";
import React, { useEffect } from "react";
import Settings from "../../settings";
import { publish, useEvent } from "../../hooks/useEvent";

function OpenSwaggerDialog(props) {
  const { small } = props;
  const [event] = useEvent("SWAGGER_DIALOG", { status: false });
  const [runtimeConnection] = useEvent("RUNTIME_CONNECTION", {
    status: false,
    metrics: { free: 50, total: 100 },
  });

  console.debug(event);

  useEffect(() => {}, []);

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
