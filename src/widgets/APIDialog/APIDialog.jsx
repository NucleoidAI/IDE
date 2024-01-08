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

function APIDialog() {
  const [context, dispatch] = useContext();

  const { open, view } = context.get("pages.api.dialog");

  const types = [
    ...(context?.nucleoid?.types || []),
    ...getTypes(context.get("nucleoid.functions")),
  ];

  if (open) {
    return (
      <NucDialog
        title={"API"}
        handleClose={() => dispatch({ type: "CLOSE_API_DIALOG" })}
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
        />
      </NucDialog>
    );
  } else return null;
}

function TabManager({ view, types, api }) {
  switch (view) {
    case "TYPES":
      return <APITypes apiData={types} />;
    case "BODY": {
      return <NewAPIBody types={types} api={api} />;
    }

    case "params":
      return <>c</>;
    default:
      return "a";
  }
}

export default APIDialog;
