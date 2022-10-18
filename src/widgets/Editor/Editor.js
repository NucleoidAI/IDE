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

const Editor = React.forwardRef((props, ref) => {
  const { api, functions, query } = props;
  const editorRef = React.useRef(null);
  const timer = React.useRef();
  const [context] = useContext();
  const file = getFile(context, props);

  function handleChange(e) {
    lint();

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
      console.log("query");
    }
  }

  const lint = () => {
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      const editor = editorRef?.current?.editor;
      const monaco = editorRef?.current?.monaco;
      const result = linter.verify(editor.getValue(), options);

      monaco.editor.setModelMarkers(
        editor.getModel(),
        "action",
        result.map((item) => {
          return {
            startLineNumber: item.line,
            startColumn: item.column,
            endLineNumber: item.endLine,
            endColumn: item.endColumn,
            message: item.message,
            severity:
              item.severity === 1
                ? monaco.MarkerSeverity.Warning
                : monaco.MarkerSeverity.Error,
          };
        })
      );

      console.log([...result]);
    }, 1000);
  };

  React.useEffect(() => {
    editorRef.current?.editor.focus();
    lint();
  });

  function handleEditorDidMount(editor, monaco) {
    const nucFuncs = context.nucleoid.functions;

    monaco.editor.getModels().forEach((item) => {
      if (
        nucFuncs.find(
          (a) => item._associatedResource.path === a.path + "_MODEL"
        )
      ) {
        item.dispose();
      }
    });

    nucFuncs.forEach((item) => {
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

    editorRef.current = { editor: editor, monaco: monaco };

    if (ref) ref.current = editor;
  }

  const lintEvent = (e) => {
    try {
      const result = linter.verifyAndFix(getFile(context, props).code, options);
      const prettyText = prettier.format(result.output, {
        parser: "babel",
        plugins: prettierPlugins,
      });

      const pos = e.getPosition();
      handleChange(prettyText);
      editorRef.current.editor.getModel().setValue(prettyText);
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
});

function getFile(context, props) {
  const { api, functions, query } = props;
  const file = { path: "", code: "" };

  if (api) {
    const selected = context.pages.api.selected;

    if(!selected) return file;

    file.path = selected?.path + selected?.method;
    file.code =
      context.nucleoid.api[selected?.path][selected?.method]["x-nuc-action"];
  }

  if (functions) {
    const selected = context.get("pages.functions.selected");
    
    if(!selected) return file;

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

export default Editor;
