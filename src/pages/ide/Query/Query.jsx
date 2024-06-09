import Editor from "../../../widgets/Editor";
import HorizontalSplitLayout from "../../../layouts/HorizontalSplitLayout";
import Page from "../../../components/Page";
import QueryResultWidget from "../../../widgets/QueryResultWidget/QueryResultWidget";
import { publish } from "@nucleoidai/react-event";
import { useContext } from "../../../context/context";
import { useEffect } from "react";
import { useEvent } from "@nucleoidai/react-event";
import { useNavigate } from "react-router-dom";

import React, { useState } from "react";

function Query() {
  const [event] = useEvent("WIDGET_LOADED", { name: null });

  const [state, setState] = useContext();
  const result = state.get("pages.query.results");
  const text = state.get("pages.query.text");

  // Define default values
  const defaultOutputRatio = state.get("pages.query.outputRatio");
  const defaultText = ""; // Assuming the default text is an empty string

  const [outputRatio, setOutputRatio] = React.useState(defaultOutputRatio);

  const [runtimeConnection] = useEvent("RUNTIME_CONNECTION");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!runtimeConnection) {
      navigate("/");
    }
  }, [runtimeConnection, navigate]);

  useEffect(() => {
    if (event.name) {
      publish("PAGE_LOADED", { name: "Query" });
    }
  }, [event.name]);

  const [loading, setLoading] = useState(false);

  const handleSetOutputRatio = (ratio) => {
    const query = state.get("pages.query");
    query.outputRatio = ratio;
    setOutputRatio(ratio);
  };

  // Effect to reset the state when the component is unmounted
  useEffect(() => {
    return () => {
      const query = state.get("pages.query");
      query.outputRatio = defaultOutputRatio;
      query.results = null; // or any default value for results
      query.text = defaultText; // Reset the text to default
      setState({ ...state });
    };
  }, []);

  useEffect(() => {
    publish("PAGE_LOADED", { name: "Query" });
  }, []);

  return (
    <Page title={"Query"}>
      <HorizontalSplitLayout
        outputRatio={outputRatio}
        topSection={
          <Editor loading={loading} setLoading={setLoading} query text={text} />
        }
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
