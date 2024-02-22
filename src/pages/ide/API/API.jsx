import APIDialog from "../../../widgets/APIDialog";
import APISettings from "../../../widgets/APISettings";
import APITree from "../../../widgets/APITree";
import Page from "../../../components/Page";
import React from "react";
import VFSEditor from "../../../widgets/VFSEditor";
import VerticalSplitLayout from "../../../layouts/VerticalSplitLayout";
function API() {
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
