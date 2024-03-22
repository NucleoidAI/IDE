import FunctionDialog from "../../../widgets/FunctionDialog/FunctionDialog";
import FunctionTree from "../../../widgets/FunctionTree";
import Page from "../../../components/Page";
import VFSEditor from "../../../widgets/VFSEditor";
import VerticalSplitLayout from "../../../layouts/VerticalSplitLayout";
import { publish } from "@nucleoidai/react-event";
import { useContext } from "../../../context/context";
import { useEvent } from "@nucleoidai/react-event";

import React, { useEffect } from "react";

function Functions() {
  const [event] = useEvent("WIDGET_LOADED", { name: "" });
  const [, dispatch] = useContext();

  useEffect(() => {
    if (event.name) {
      publish("PAGE_LOADED", { name: "Functions" });
    }
  }, [event.name]);

  function openFunctionDialog(item) {
    dispatch({
      type: "OPEN_FUNCTION_DIALOG",
      payload: { type: item.toUpperCase() },
    });
  }

  return (
    <Page title={"Functions"}>
      <VerticalSplitLayout
        dialog={<FunctionDialog />}
        content1={<FunctionTree openFunctionDialog={openFunctionDialog} />}
        content2={<VFSEditor functions />}
      />
    </Page>
  );
}

export default Functions;
