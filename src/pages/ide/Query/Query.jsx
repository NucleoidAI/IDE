import Editor from "../../../widgets/Editor";
import HorizontalSplitLayout from "../../../layouts/HorizontalSplitLayout";
import Page from "../../../components/Page";
import QueryResultWidget from "../../../widgets/QueryResultWidget/QueryResultWidget";
import { useContext } from "../../../context/context";
import { useEvent } from "@nucleoidjs/react-event";
import { useNavigate } from "react-router-dom";

import React, { useState } from "react";

function Query() {
  const [state] = useContext();
  const result = state.get("pages.query.results");
  const [outputRatio, setOutputRatio] = React.useState(
    state.get("pages.query.outputRatio")
  );

  const [runtimeConnection] = useEvent("RUNTIME_CONNECTION");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!runtimeConnection) {
      navigate("/");
    }
  }, [runtimeConnection, navigate]);

  const [loading, setLoading] = useState(false);

  const handleSetOutputRatio = (ratio) => {
    const query = state.get("pages.query");
    query.outputRatio = ratio;
    setOutputRatio(ratio);
  };

  return (
    <Page title={"Query"}>
      <HorizontalSplitLayout
        outputRatio={outputRatio}
        topSection={<Editor loading={loading} setLoading={setLoading} query />}
        bottomSection={
          <QueryResultWidget
            result={result}
            loading={loading}
            handleSetOutputRatio={handleSetOutputRatio}
            outputRatio={outputRatio}
          />
        }
      />
    </Page>
  );
}

export default Query;
