import OpenSandboxButton from "../../components/OpenSandboxButton";
import OpenSwaggerButton from "../../components/OpenSwaggerButton";
import React from "react";
import Settings from "../../settings";
import useLayout from "../../hooks/useLayout";

const StatusSmall = () => {
  const [, dispatch, getStatus] = useLayout();

  return (
    <>
      {Settings.runtime() && ""}
      {Settings.runtime() === "npx" && (
        <OpenSwaggerButton
          small
          clickEvent={() => {
            dispatch({
              type: "SWAGGER_DIALOG",
              payload: { dialogStatus: true },
            });
            getStatus();
          }}
        />
      )}
      {Settings.runtime() === "sandbox" && (
        <OpenSandboxButton
          small
          clickEvent={() => {
            dispatch({ type: "SANDBOX", payload: { dialogStatus: true } });
            getStatus();
          }}
        />
      )}
    </>
  );
};

export default StatusSmall;
