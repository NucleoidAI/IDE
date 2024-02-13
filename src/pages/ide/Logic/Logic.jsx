import LogicDialog from "../../../widgets/LogicDialog/LogicDialog";
import LogicTree from "../../../widgets/LogicTree";
import QueryEditor from "../../../widgets/QueryEditor";
import React from "react";
import VerticalSplitLayout from "../../../layouts/VerticalSplitLayout";
import actions from "../../../actions";
import { useContext } from "../../../context/context";

function Logic() {
  const [, dispatch] = useContext();

  function openLogicDialog() {
    dispatch({
      type: actions.openLogicDialog,
    });
  }

  return (
    <VerticalSplitLayout
      dialog={<LogicDialog />}
      content1={<LogicTree openLogicDialog={openLogicDialog} />}
      content2={<QueryEditor logic />}
    />
  );
}

export default Logic;
