import HubIcon from "@mui/icons-material/Hub";
import PromptCodeDialog from "../../components/PromptCodeDialog";
import actions from "../../actions";
import { deepCopy } from "../../utils/DeepCopy";
import { publish } from "@nucleoidjs/react-event";
import service from "../../service";
import { useContext } from "../../context/context";

import React, { useState } from "react";

function AIDialog() {
  const [context, dispatch] = useContext();
  const [loading, setLoading] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");

  const functions = context.nucleoid.functions;

  const editorRef = React.useRef(null);

  const data = React.useRef({
    request: "",
  });

  const setEditorRef = (ref) => {
    editorRef.current = ref;
  };

  const generateContent = () => {
    const nucFunctions = deepCopy(functions);
    return nucFunctions.map((item) => item.definition).join("\n");
  };

  const handleSendAIClick = () => {
    const { monaco } = editorRef?.current || {};

    if (promptValue) {
      setLoading(true);

      service
        .logic(generateContent().trim(), promptValue?.trim())
        .then((res) => {
          setSummary(res.data.summary);
          setDescription(res.data.description);
          const model = monaco.editor.createModel(
            res.data.code?.trim(),
            "typescript"
          );

          editorRef.current.editor.setModel(model);
          setIsCodeGenerated(true);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleInputChange = (e) => {
    data.current.request = e.currentTarget.value;
    setPromptValue(data.current.request);
  };

  function logicValidation(generatedCode) {
    const declarationClass = generatedCode
      ?.split("$")[1]
      ?.match(/\b(\w+)\b/)[0];

    return functions.find((func) => func.path === `/${declarationClass}`);
  }

  const handleSaveAIResponse = () => {
    const generatedCode = editorRef.current.editor.getModel().getValue();

    if (logicValidation(generatedCode)) {
      dispatch({
        type: "SAVE_LOGIC_DIALOG",
        payload: {
          description: description,
          summary: summary,
          definition: generatedCode,
        },
      });
    } else {
      publish("GLOBAL_MESSAGE", {
        status: true,
        message: `You can only create declaration for existing functions.`,
        severity: "error",
      });
    }
    handleClose();
  };

  const onCodeEditorChange = () => {};

  const handleClose = () => {
    dispatch({ type: actions.closeLogicDialog });
    setIsCodeGenerated(false);
    setPromptValue("");
  };
  return (
    <PromptCodeDialog
      logic
      logo={HubIcon}
      title={"Logic"}
      inputPlaceHolder={"Explain Logic"}
      handleSendAIClick={handleSendAIClick}
      handleSaveAIResponse={handleSaveAIResponse}
      handlePromptChange={handleInputChange}
      onCodeEditorChange={onCodeEditorChange}
      setPromptValue={setPromptValue}
      setEditorRef={setEditorRef}
      handleClose={handleClose}
      promptValue={promptValue}
      isCodeGenerated={isCodeGenerated}
      loading={loading}
    />
  );
}

export default AIDialog;
