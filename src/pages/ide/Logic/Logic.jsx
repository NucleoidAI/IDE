import AIDialog from "../../../widgets/AIDialog/AIDialog";
import Editor from "../../../widgets/Editor";
import LogicTree from "../../../widgets/LogicTree";
import Page from "../../../components/Page";
import React from "react";
import VerticalSplitLayout from "../../../layouts/VerticalSplitLayout";
import actions from "../../../actions";
import { useContext } from "../../../context/context";
import { useEffect } from "react";

import { publish, useEvent } from "@nucleoidai/react-event";

function Logic() {
  const [event] = useEvent("WIDGET_LOADED", { name: "" });
  const [, dispatch] = useContext();
  useEffect(() => {
    if (event.name) {
      publish("PAGE_LOADED", { name: "Logic" });
    }
  }, [event.name]);

  function openAIDialog() {
    dispatch({
      type: actions.openAIDialog,
      payload: { page: "logic" },
    });
  }

  return (
    <Page title={"Logic"}>
      <VerticalSplitLayout
        dialog={<AIDialog declarative page={"logic"} />}
        content1={<LogicTree openLogicDialog={openAIDialog} />}
        content2={<Editor logic />}
      />
    </Page>
  );
}

export default Logic;
