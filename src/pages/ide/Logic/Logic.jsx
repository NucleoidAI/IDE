import { Box } from "@mui/system";
import Editor from "../../../widgets/Editor";
import LogicTree from "../../../widgets/LogicTree";
import React from "react";
import VerticalSplitLayout from "../../../layouts/VerticalSplitLayout";
function Logic() {
  return (
    <VerticalSplitLayout
      dialog={<Box />}
      content1={<LogicTree />}
      content2={<Editor name={"api"} api />}
    />
  );
}

export default Logic;
