/* eslint-disable */

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Project from "../../lib/Project.js";
import PromptCodeDialog from "../../components/PromptCodeDialog";
import actions from "../../actions";
import { deepCopy } from "../../utils/DeepCopy";
import http from "../../http";
import { publish } from "@nucleoidai/react-event";
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

  const functions = context.specification.functions;
  const declarations = context.specification.declarations;

  const editorRef = React.useRef(null);

  const mode = declarative === true ? "DECLARATIVE" : "IMPERATIVE";

  const data = React.useRef({
    request: "",
  });

  const generateContext = () => {
    const context = [];

    const nucDeclarations = deepCopy(declarations);
    const nucFunctions = deepCopy(functions);

    if (editor?.current) {
      const mEditor = editor.current.editor;
      const selected = mEditor
        ?.getModel()
        .getValueInRange(mEditor?.getSelection());
      if (selected) {
        context.push(selected);
      }
    }

    nucFunctions.map((item) => context.push(item.definition));
    nucDeclarations.map((item) => context.push(item.definition));
    return context;
  };

  // needs to return description and summary (AIDialog Q&A)
  const handleSendAIClick = () => {
    const { monaco } = editorRef?.current || {};

    if (promptValue) {
      setLoading(true);
      setDescription(promptValue);

      http
        .post("/chat/completions", {
          mode,
          role: "USER",
          context: generateContext(),
          content: promptValue?.trim(),
        })
        .then((res) => {
          let code;
          const { functions, declarations, imperatives } = Project.compile([
            res.data.code,
          ]);

          if (page === "api") {
            code = `function action() {
${imperatives[0]};
}`;
          } else if (page === "logic") {
            code = declarations[0].definition;
            setSummary(res.data.summary);
          } else if (page === "query") {
            code = imperatives[0];
          } else if (page === "function") {
            code = functions[0];
          }
          const model = monaco.editor.createModel(code, "typescript");

          editorRef.current.nucEditor.setModel(model);
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
    const generatedCode = editorRef.current.nucEditor?.getModel().getValue();
    if (mode === "DECLARATIVE") {
      handleSaveDeclarative(generatedCode);
    }
    if (mode === "IMPERATIVE") {
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
      publish("APP_MESSAGE", {
        message: `You can only create declaration for existing functions.`,
        severity: "error",
      });
    }
  }

  const handleSaveImperative = (generatedCode) => {
    const mEditor = editor.current.editor;

    if (page === "api") {
      const action = prettierStandalone.format(generatedCode, {
        plugins,
      });
      mEditor?.getModel().setValue(action);
    }
    if (page === "query") {
      const query = context.get("pages.query");
      query.text = generatedCode;
    }
  };

  const editorOnMount = (nucEditor, monaco) => {
    editorRef.current = { nucEditor, monaco };
  };

  const handleClose = () => {
    dispatch({ type: actions.closeAIDialog, payload: { page } });
    setIsCodeGenerated(false);
    setPromptValue("");
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      handleSendAIClick();
    }
  };

  const handleResetClick = () => {
    // Reset the state to its initial values
    setLoading(false);
    setPromptValue("");
    setIsCodeGenerated(false);
    setSummary("");
    setDescription("");
  };

  return (
    <PromptCodeDialog
      logic
      logo={AutoAwesomeIcon}
      title={mode}
      page={page}
      inputPlaceHolder={page}
      onKeyDown={handleKeyDown}
      handleSendAIClick={handleSendAIClick}
      handleSaveAIResponse={handleSaveAIResponse}
      handlePromptChange={handleInputChange}
      setPromptValue={setPromptValue}
      onMount={editorOnMount}
      handleClose={handleClose}
      promptValue={promptValue}
      isCodeGenerated={isCodeGenerated}
      loading={loading}
      handleResetClick={handleResetClick}
    />
  );
}

export default AIDialog;
