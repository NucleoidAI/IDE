import AIDialog from "../../../widgets/AIDialog/AIDialog";
import Editor from "../../../widgets/Editor";
import LogicTree from "../../../widgets/LogicTree";
import Page from "../../../components/Page";
import React from "react";
import VerticalSplitLayout from "../../../layouts/VerticalSplitLayout";
import actions from "../../../actions";
import { publish, useEvent } from "@nucleoidjs/react-event";
import { useContext } from "../../../context/context";
import { useEffect } from "react";

function Logic() {
  const [event] = useEvent("WIDGET_LOADED", { name: "" });
  const [, dispatch] = useContext();
  useEffect(() => {
    if (event.name) {
      publish("WIDGET_LOADED", { name: "Logic" });
      console.log("WIDGET_LOADED", event.name);
    }
  }, []);

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
