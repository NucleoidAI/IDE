import { Context } from "../context";
import EditableScrollList from "../components/EditableScrollList";
import ScrollList from "../components/ScrollList";

import React, { useContext } from "react";

export default function TreeWidget({ editable }) {
  const [state] = useContext(Context);
  const apiList = Object.keys(state.nucleoid.api);

  return (
    <>
      {editable ? (
        <ScrollList list={apiList} />
      ) : (
        <EditableScrollList list={apiList} />
      )}
    </>
  );
}
