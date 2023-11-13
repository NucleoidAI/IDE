import APIDialogAction from "../../components/APIDialogAction";
import APIPath from "../../components/APIPath";
import APITypes from "../../components/APITypes";
import AdressTree from "./Test";
import NucDialog from "../../components/core/nucDialog/nucDialog";
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
        sx={{ width: 900 }}
      >
        <APIPath />
        <TabManager view={view} types={types} />
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

function TabManager({ view, types }) {
  switch (view) {
    case "TYPES":
      return <APITypes types={types} />;
    case "BODY": {
      return <AdressTree />;
    }

    case "params":
      return <>c</>;
    default:
      return "a";
  }
}

export default APIDialog;
