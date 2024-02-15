import CodeDialog from "../../components/AIDialog/CodeDialog";
import actions from "../../actions";
import service from "../../service";
import { useContext } from "../../context/context";

import { useEffect, useState } from "react";

function AIDialog(props) {
  const { logic, api } = props;

  const [, dispatch] = useContext();
  const [loading, setLoading] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCodeChanged, setIsCodeChanged] = useState(false);
  const [response, setResponse] = useState();

  const handleSendAIClick = () => {
    if (logic) {
      setLoading(true);
      /*
      dispatch({
        type: "SAVE_LOGIC_DIALOG",
        payload: {
          description: inputValue,
          summary: "If the human is under 18 years of age",
          definition: `{
          if( $Human.age < 18 )
          {
            //do something
          }
        }`,
        },
      });
      */
    }
    if (api) {
      setLoading(true);
      service
        .openai(promptValue)
        .then((res) => {
          setGeneratedCode(res.data.text?.trim());
        })
        .finally(() => setLoading(false));
    }
  };

  const handleInputChange = (e) => {
    setPromptValue(e.target.value);
    console.log("prompt input change", e.target.value);
  };

  const handleSaveAIResponse = () => {
    console.log("ai response save");
    setPromptValue("");
    setGeneratedCode("");
    setLoading(false);
    dispatch({ type: actions.closeLogicDialog });
  };

  const handleEditorChange = (e) => {
    console.log("editor change");
  };

  const saveChangedCode = () => {
    setIsCodeChanged(false);
  };

  const onCodeEditorChange = (e) => {
    setIsCodeChanged(true);
  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        setPromptValue("");
        setGeneratedCode(` 
        if( $Human.age < 18 )
          {
            //do something
          }
          `);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <CodeDialog
      handleSendAIClick={handleSendAIClick}
      handleSaveAIResponse={handleSaveAIResponse}
      handlePromptChange={handleInputChange}
      handleEditorChange={handleEditorChange}
      saveChangedCode={saveChangedCode}
      onCodeEditorChange={onCodeEditorChange}
      setPromptValue={setPromptValue}
      isCodeChanged={isCodeChanged}
      promptValue={promptValue}
      generatedCode={generatedCode}
      loading={loading}
    />
  );
}

export default AIDialog;
