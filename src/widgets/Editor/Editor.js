import MonacoEditor from "@monaco-editor/react";
import React from "react";
import { contextToMap } from "../../utils/Parser";
import linter from "../../linter";
//import { parser } from "react-nucleoid";
import prettier from "../../prettier";
import prettierPlugins from "../../prettierPlugins";
import { publish } from "../../Event";
import rules from "./rules";
import { useContext } from "../../context/context";

function getFile(context, props) {
  const { api, functions, query } = props;
  const file = { path: "", code: "" };

  if (api) {
    const selected = context.pages.api.selected;
    file.path = selected.path + selected.method;
    file.code =
      context.nucleoid.api[selected.path][selected.method]["x-nuc-action"];
  }

  if (functions) {
    const selected = context.get("pages.functions.selected");
    file.path = selected;
    file.code = context.nucleoid.functions.find(
      (item) => item.path === selected
    ).definition;
  }

  if (query) {
    console.log("query");
  }

  return file;
}

const Editor = (props) => {
  const { api, functions, query } = props;
  const ref = React.useRef(null);
  const [context] = useContext();
  const file = getFile(context, props);

  function handleChange(e) {
    if (api) {
      const selected = context.pages.api.selected;
      context.nucleoid.api[selected.path][selected.method]["x-nuc-action"] = e;
    }

    if (functions) {
      const selected = context.get("pages.functions.selected");
      context.nucleoid.functions.find(
        (item) => item.path === selected
      ).definition = e;
    }

    if (query) {
      console.log("hello");
    }
  }

  React.useEffect(() => {
    setTimeout(() => {
      ref.current?.focus();
    }, 5);
  });

  function handleEditorDidMount(editor, monaco) {
    const fncs = context.nucleoid.functions;

    monaco.editor.getModels().forEach((item) => {
      if (
        fncs.find((a) => item._associatedResource.path === a.path + "_MODEL")
      ) {
        item.dispose();
      }
    });

    fncs.forEach((item) => {
      const pth = monaco.Uri.from({ path: item.path + "_MODEL" });

      monaco.editor.createModel(
        item.definition,
        item.ext === "js" ? "javascript" : "typescript",
        pth
      );
    });

    editor.onDidBlurEditorWidget(() => {
      let key;
      if (api) {
        const { path, method } = context.get("pages.api.selected");
        key = path + "." + method + ".ts";
      } else {
        key = context.get("pages.functions.selected") + ".js";
      }

      publish("CONTEXT_CHANGED", {
        // TODO Optimize preparing files
        files: contextToMap(context.nucleoid).filter(
          (item) => item.key === key
        ),
      });
    });

    editor.addAction({
      id: "lintEvent",
      label: "lintEvent",
      keybindings: [
        monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
        monaco.KeyMod.chord(
          monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF
        ),
      ],

      run: (e) => lintEvent(e),
    });

    ref.current = editor;
  }

  const lintEvent = (e) => {
    const options = {
      env: {
        es6: true,
        node: true,
      },

      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
      },
      rules,
    };

    try {
      const result = linter.verifyAndFix(getFile(context, props).code, options);
      const prettyText = prettier.format(result.output, {
        parser: "babel",
        plugins: prettierPlugins,
      });

      const pos = e.getPosition();
      handleChange(prettyText);
      ref.current.getModel().setValue(prettyText);
      e.setPosition(pos);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MonacoEditor
      height={"100%"}
      defaultLanguage="javascript"
      defaultValue={file.code}
      onChange={handleChange}
      onMount={handleEditorDidMount}
      path={file.path}
      options={{
        minimap: {
          enabled: false,
        },
      }}
    />
  );
};

export default Editor;
