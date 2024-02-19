import AIDialog from "../../../widgets/AIDialog/AIDialog";
import LogicTree from "../../../widgets/LogicTree";
import Page from "../../../components/Page";
import Editor from "../../../widgets/Editor";
import React from "react";
import VerticalSplitLayout from "../../../layouts/VerticalSplitLayout";
import actions from "../../../actions";
import { useContext } from "../../../context/context";

function Logic() {
  const [, dispatch] = useContext();

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
