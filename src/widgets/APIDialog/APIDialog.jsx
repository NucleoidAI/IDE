import APIDialogAction from "../../components/APIDialogAction";
import APIPath from "../../components/APIPath";
import AdressTree from "./Test";
import NucDialog from "../../components/core/nucDialog/nucDialog";
import React from "react";
import { getTypes } from "../../lib/TypeScript";
import { useContext } from "../../context/context";

function APIDialog() {
  const [context, dispatch] = useContext();
  const { open, view } = context.get("pages.api.dialog");
  context.get("nucleoid");
  const tsTypes = getTypes(context.get("nucleoid.functions"));
  console.log(tsTypes, context.get("nucleoid.functions"));
  console.log([...(context?.nucleoid?.types || []), ...tsTypes]);
  if (open) {
    return (
      <NucDialog
        title={"API"}
        handleClose={() => dispatch({ type: "CLOSE_API_DIALOG" })}
        action={<APIDialogAction view={view} />}
      >
        <APIPath />
        <TabManager view={view} />
      </NucDialog>
    );
  } else return null;
}

function TabManager({ view }) {
  console.log(view);
  switch (view) {
    case "type":
      return <>a</>;
    case "BODY": {
      console.log(view);
      return <AdressTree />;
    }

    case "params":
      return <>c</>;
    default:
      return "a";
  }
}

export default APIDialog;
