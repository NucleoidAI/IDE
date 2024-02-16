import AIDialog from "../../../widgets/AIDialog/AIDialog";
import LogicTree from "../../../widgets/LogicTree";
import Page from "../../../components/Page";
import QueryEditor from "../../../widgets/QueryEditor";
import React from "react";
import VerticalSplitLayout from "../../../layouts/VerticalSplitLayout";
import actions from "../../../actions";
import { useContext } from "../../../context/context";

function Logic() {
  const [, dispatch] = useContext();

  function openAIDialog() {
    dispatch({
      type: actions.openLogicDialog,
    });
  }

  return (
    <Page title={"Logic"}>
      <VerticalSplitLayout
        dialog={<AIDialog logic />}
        content1={<LogicTree openLogicDialog={openAIDialog} />}
        content2={<QueryEditor logic />}
      />
    </Page>
  );
}

export default Logic;
