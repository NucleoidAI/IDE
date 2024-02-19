import HubIcon from "@mui/icons-material/Hub";
import PromptCodeDialog from "../../components/PromptCodeDialog";
import actions from "../../actions";
import { deepCopy } from "../../utils/DeepCopy";
import { publish } from "@nucleoidjs/react-event";
import service from "../../service";
import { useContext } from "../../context/context";

import React, { useState } from "react";

import * as angularPlugin from "prettier/parser-angular";
import * as babelPlugin from "prettier/parser-babel";
import * as glimmerPlugin from "prettier/parser-glimmer";
import * as graphqlPlugin from "prettier/parser-graphql";
import * as htmlPlugin from "prettier/parser-html";
import * as markdownPlugin from "prettier/parser-markdown";
import * as meriyahPlugin from "prettier/parser-meriyah";
import * as prettierStandalone from "prettier/standalone";
import * as typescriptPlugin from "prettier/parser-typescript";
import * as yamlPlugin from "prettier/parser-yaml";

function AIDialog({ editor, declarative, imperative, page }) {
  const [context, dispatch] = useContext();
  const [loading, setLoading] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const plugins = [
    angularPlugin,
    babelPlugin,
    glimmerPlugin,
    graphqlPlugin,
    htmlPlugin,
    markdownPlugin,
    meriyahPlugin,
    typescriptPlugin,
    yamlPlugin,
  ];

  const functions = context.nucleoid.functions;
  const declarations = context.nucleoid.declarations;

  const editorRef = React.useRef(null);

  const mode = declarative === true ? "declarative" : "imperative";

  const data = React.useRef({
    request: "",
  });

  const setEditorRef = (ref) => {
    editorRef.current = ref;
  };
  const generateContent = () => {
    const context = [];

    const nucDeclarations = deepCopy(declarations);
    const nucFunctions = deepCopy(functions);

    if (editor?.current) {
      const mEditor = editor.current.editor;
      const selected = mEditor
        .getModel()
        .getValueInRange(mEditor.getSelection());
      if (selected) {
        context.push(selected);
      }
    }

    nucFunctions.map((item) => context.push(item.definition));
    nucDeclarations.map((item) => context.push(item.definition));

    return context;
  };

  const handleSendAIClick = () => {
    const { monaco } = editorRef?.current || {};

    if (promptValue) {
      setLoading(true);
      service
        .completions(mode, generateContent(), promptValue?.trim())
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
    if (mode === "declarative") {
      handleSaveDeclarative(generatedCode);
    }
    if (mode === "imperative") {
      handleSaveImperative(generatedCode);
    }

    handleClose();
  };

  function handleSaveDeclarative(generatedCode) {
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
  }

  const handleSaveImperative = (generatedCode) => {
    const mEditor = editor.current.editor;
    const lineNumber = mEditor.getSelection().endLineNumber;
    const selected = mEditor.getModel().getValueInRange(mEditor.getSelection());

    if (selected) {
      const withLine = mEditor.getModel().getValue().split("\n");

      withLine.splice(lineNumber, 0, generatedCode);
      const res = withLine.join("\n");
      const prettyText = prettierStandalone.format(res, {
        plugins,
      });

      mEditor.getModel().setValue(prettyText);
    } else {
      const action = prettierStandalone.format(
        `
      function action(req) {
        ${generatedCode}
      }
      `,
        {
          plugins,
        }
      );
      mEditor.getModel().setValue(action);
    }
  };

  const onCodeEditorChange = () => {};

  const handleClose = () => {
    dispatch({ type: actions.closeAIDialog, payload: { page } });
    setIsCodeGenerated(false);
    setPromptValue("");
  };

  return (
    <PromptCodeDialog
      logic
      logo={HubIcon}
      title={mode}
      page={page}
      inputPlaceHolder={page}
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
