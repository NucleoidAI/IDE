import APIDialogAction from "../../components/APIDialogAction";
import APIPath from "../../components/APIPath";
import APITypes from "../../components/APITypes";
// import AdressTree from "./Test";
import NewAPIBody from "./NewAPIBody";
import NucDialog from "../../components/core/NucDialog/NucDialog";
//BasicDialog
import React from "react";
import { getTypes } from "../../lib/TypeScript";
import { useContext } from "../../context/context";
import { useRef } from "react";

function APIDialog() {
  const requestSchemaRef = useRef();
  const responseSchemaRef = useRef();

  const [context, dispatch] = useContext();

  const saveApiDialog = () => {
    const requestOutput = JSON.stringify(
      requestSchemaRef.current.schemaOutput(),
      null,
      2
    );
    const responseOutput = JSON.stringify(
      responseSchemaRef.current.schemaOutput(),
      null,
      2
    );
    console.log("request: ", requestOutput);
    console.log("response: ", responseOutput);
  };

  const { open, view } = context.get("pages.api.dialog");

  const selected = context.get("pages.api.selected");
  const selectedApi = context
    .get("nucleoid.api")
    .find(
      (api) => api.path === selected?.path && api.method === selected.method
    );

  const types = [
    ...(context?.nucleoid?.types || []),
    ...getTypes(context.get("nucleoid.functions")),
  ];

  if (open) {
    return (
      <NucDialog
        title={"API"}
        handleClose={() => dispatch({ type: "CLOSE_API_DIALOG" })}
        sx={{ width: 900 }}
      >
        <APIPath />
        <TabManager
          view={view}
          types={types}
          api={context.nucleoid.api}
          selectedApi={selectedApi}
          requestSchemaRef={requestSchemaRef}
          responseSchemaRef={responseSchemaRef}
          saveApiDialog={() => saveApiDialog}
        />
        <APIDialogAction
          view={view}
          setApiDialogView={(button) =>
            dispatch({
              type: "SET_API_DIALOG_VIEW",
              payload: { view: button },
            })
          }
          saveApiDialog={() => saveApiDialog()}
        />
      </NucDialog>
    );
  } else return null;
}

function TabManager({
  view,
  types,
  api,
  selectedApi,
  requestSchemaRef,
  responseSchemaRef,
}) {
  switch (view) {
    case "TYPES":
      return <APITypes apiData={types} />;
    case "BODY": {
      return (
        <NewAPIBody
          types={types}
          api={selectedApi}
          requestSchemaRef={requestSchemaRef}
          responseSchemaRef={responseSchemaRef}
        />
      );
    }

    case "params":
      return <>c</>;
    default:
      return "a";
  }
}

export default APIDialog;
