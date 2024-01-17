import Editor from "../../../widgets/Editor";
import FunctionDialog from "../../../widgets/FunctionDialog/FunctionDialog";
import FunctionTree from "../../../widgets/FunctionTree";
import Page from "../../../components/Page";
import VerticalSplitLayout from "../../../layouts/VerticalSplitLayout";
import { useContext } from "../../../context/context";

function Functions() {
  const [, dispatch] = useContext();

  function openFunctionDialog(item) {
    dispatch({
      type: "OPEN_FUNCTION_DIALOG",
      payload: { type: item.toUpperCase() },
    });
  }

  return (
    <Page title={"Functions"}>
      <VerticalSplitLayout
        dialog={<FunctionDialog />}
        content1={<FunctionTree openFunctionDialog={openFunctionDialog} />}
        content2={<Editor functions />}
      />
    </Page>
  );
}

export default Functions;
