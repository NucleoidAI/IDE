import APIDialog from "../../../widgets/APIDialog";
import APISettings from "../../../widgets/APISettings";
import APITree from "../../../widgets/APITree";
import Page from "../../../components/Page";
import VFSEditor from "../../../widgets/VFSEditor";
import VerticalSplitLayout from "../../../layouts/VerticalSplitLayout";
import { publish } from "@nucleoidai/react-event";
import { useEvent } from "@nucleoidai/react-event";

import React, { useEffect } from "react";

function API() {
  const [event] = useEvent("WIDGET_LOADED", { name: "" });

  useEffect(() => {
    if (event.name) {
      publish("PAGE_LOADED", { name: "API" });
    }
  }, [event.name]);
  return (
    <Page title={"API"}>
      <VerticalSplitLayout
        dialog={<APIDialog />}
        content1={<APITree />}
        content2={<VFSEditor name={"api"} api />}
        content3={<APISettings />}
      />
    </Page>
  );
}

export default API;
