import OpenSandboxButton from "../../components/OpenSandboxButton";
import OpenSwaggerButton from "../../components/OpenSwaggerButton";
import React from "react";
import Settings from "../../settings";
import { publish, useEvent } from "../../hooks/useEvent";

function OpenSwaggerDialog(props) {
  const { small } = props;

  const event = useEvent("SWAGGER_DIALOG");
  console.log(event, "from openswgaerdialog");

  const openSwaggerDialog = () => {
    publish("SWAGGER_DIALOG", { open: true });
  };

  return (
    <>
      {Settings.runtime() === "npx" && (
        <OpenSwaggerButton clickEvent={openSwaggerDialog} small={small} />
      )}
      {Settings.runtime() === "sandbox" && (
        <OpenSandboxButton clickEvent={openSwaggerDialog} small={small} />
      )}
    </>
  );
}

export default OpenSwaggerDialog;
