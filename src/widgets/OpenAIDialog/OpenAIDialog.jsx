import CircularProgress from "@mui/material/CircularProgress";
import OpenAI from "../../icons/OpenAI";
import OpenAIButton from "../../components/OpenAIButton";
import PromptCodeDialog from "../../components/PromptCodeDialog/PromptCodeDialog";
import Settings from "../../settings";
import actions from "../../actions";
import { deepCopy } from "../../utils/DeepCopy";
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

function OpenAIDialog({ functions, editor }) {
  const [, dispatch] = useContext();
  const [loading, setLoading] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  const [login, setLogin] = useState(false);
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

  const data = React.useRef({
    request: "",
  });

  const editorRef = React.useRef(null);

  const setEditorRef = (ref) => {
    editorRef.current = ref;
  };

  const handleClickOpen = () => {
    //resetTranscript();
    if (!Settings.token()) {
      data.current.request = "";
      data.current.content = "";
      dispatch({
        type: actions.openOpenAIDialog,
      });
    } else {
      setLogin(true);
      // TODO : replace refreshToken and accessToken with storage

      service
        .getProjects()
        .then(() => {
          data.current.request = "";
          data.current.content = "";
          dispatch({
            type: actions.openOpenAIDialog,
          });
        })
        .finally(() => {
          setLogin(false);
        });
    }
  };

  const generateContent = () => {
    if (editor.current) {
      const mEditor = editor.current.editor;

      const nucFunctions = deepCopy(functions);
      const selected = mEditor
        .getModel()
        .getValueInRange(mEditor.getSelection());

      return nucFunctions.map((item) => item.definition).join("\n") + selected;
    }
  };

  const onCodeEditorChange = () => {};

  const handleSendAIClick = async () => {
    const { monaco } = editorRef?.current || {};

    if (promptValue) {
      setLoading(true);
      service
        .openai(generateContent().trim(), promptValue?.trim())
        .then((res) => {
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

  function handleSaveAIResponse() {
    const mEditor = editor.current.editor;
    const lineNumber = mEditor.getSelection().endLineNumber;
    const generatedCode = editorRef.current.editor.getModel().getValue();
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
    handleClose();
  }

  const handleInputChange = (e) => {
    data.current.request = e.currentTarget.value;
    setPromptValue(data.current.request);
  };

  const handleClose = () => {
    dispatch({ type: actions.closeOpenAIDialog });
    setIsCodeGenerated(false);
    setPromptValue("");
  };

  return (
    <div>
      {!login ? (
        <>
          <OpenAIButton clickEvent={handleClickOpen} />
        </>
      ) : (
        <CircularProgress
          size={25}
          sx={{
            position: "relative",
            textTransform: "none",
            bottom: 20,
            left: 50,
          }}
        />
      )}
      <PromptCodeDialog
        openAI
        handleSendAIClick={handleSendAIClick}
        handleSaveAIResponse={handleSaveAIResponse}
        handlePromptChange={handleInputChange}
        onCodeEditorChange={onCodeEditorChange}
        setPromptValue={setPromptValue}
        promptValue={promptValue}
        isCodeGenerated={isCodeGenerated}
        loading={loading}
        title="OpenAI"
        inputPlaceHolder='Create item with name "item-1"...'
        logo={OpenAI}
        setEditorRef={setEditorRef}
        handleClose={handleClose}
      />
    </div>
  );
}

export default OpenAIDialog;
