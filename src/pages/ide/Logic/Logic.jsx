import AIDialog from "../../../widgets/AIDialog/AIDialog";
import LogicTree from "../../../widgets/LogicTree";
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
    <VerticalSplitLayout
      dialog={<AIDialog logic />}
      content1={<LogicTree openLogicDialog={openAIDialog} />}
      content2={<QueryEditor logic />}
    />
  );
}

export default Logic;
