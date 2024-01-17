import APIDialog from "../../../widgets/APIDialog";
import APISettings from "../../../widgets/APISettings";
import APITree from "../../../widgets/APITree";
import Editor from "../../../widgets/Editor";
import Page from "../../../components/Page";
import React from "react";
import VerticalSplitLayout from "../../../layouts/VerticalSplitLayout";
function API() {
  return (
    <Page title={"API"}>
      <VerticalSplitLayout
        dialog={<APIDialog />}
        content1={<APITree />}
        content2={<Editor name={"api"} api />}
        content3={<APISettings />}
      />
    </Page>
  );
}

export default API;
