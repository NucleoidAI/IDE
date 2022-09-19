import OpenSandboxButton from "../../components/OpenSandboxButton";
import OpenSwaggerButton from "../../components/OpenSwaggerButton";
import React from "react";
import Settings from "../../settings";

function OpenSwaggerDialog(props) {
  const { small } = props;
  return (
    <>
      {Settings.runtime() === "npx" && <OpenSwaggerButton small={small} />}
      {Settings.runtime() === "sandbox" && <OpenSandboxButton small={small} />}
    </>
  );
}

export default OpenSwaggerDialog;
