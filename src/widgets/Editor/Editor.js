import MonacoEditor from "@monaco-editor/react";
import OpenAI from "../OpenAI";
import React from "react";
import { contextToMap } from "../../utils/Parser";
import linter from "../../linter";
import { parser } from "react-nucleoid";
import { publish } from "@nucleoidjs/synapses";
import rules from "./rules";
import { useContext } from "../../context/context";
import useService from "../../hooks/useService";
import { Backdrop, Box } from "@mui/material";

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
  globals: {},
};

const Editor = React.forwardRef((props, ref) => {
  const { api, functions, query } = props;
  const editorRef = React.useRef(null);
  const timerRef = React.useRef();
  const [open, setOpen] = React.useState(false);
  const [context] = useContext();
  const [, , , handleSaveProject] = useService();
  const file = getFile(context, props);

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

  const checkFunction = React.useCallback(() => {
    const editor = editorRef?.current?.editor;
    const monaco = editorRef?.current?.monaco;
    const value = editor?.getValue();
    if (!api) return true;

    try {
      parser.fn(value);

      monaco.editor.setModelMarkers(editor?.getModel(), "action", []);
      return true;
    } catch (err) {
      console.log(err);
      monaco.editor.setModelMarkers(editor?.getModel(), "action", [
        {
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: 1000,
          message: "Need action function",
          severity: 1,
        },
      ]);
      return false;
    }
  }, [api]);

  function handleChange(e) {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      compile();
      checkFunction();
      lint();
    }, 400);

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

  const compile = React.useCallback(() => {
    let key;

    if (api) {
      const { path, method } = context.get("pages.api.selected");
      key = path + "." + method + ".ts";
    } else {
      key = context.get("pages.functions.selected") + ".js";
    }

    publish("CONTEXT_CHANGED", {
      // TODO Optimize preparing files
      files: contextToMap(context.nucleoid).filter((item) => item.key === key),
    });
  }, [api, context]);

  const lint = React.useCallback(() => {
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
  }, []);

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
    options.globals = {};
    nucFuncs.forEach((item) => {
      const pth = monaco.Uri.from({ path: item.path + "_MODEL" });
      options.globals[item.path.split("/")[1]] = "writable";
      monaco.editor.createModel(
        item.definition,
        item.ext === "js" ? "javascript" : "typescript",
        pth
      );
    });

    editor.addAction({
      id: "saveEvent",
      label: "Save Project",
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS),
      ],

      run: (e) => {
        setOpen(true);
        handleSaveProject((evnt) => {
          setOpen(evnt);
        });
      },
    });

    monaco.languages.registerDocumentFormattingEditProvider("javascript", {
      provideDocumentFormattingEdits(model, options) {
        const result = linter.verifyAndFix(
          getFile(context, props).code,
          options
        );

        const formatted = prettierStandalone.format(result.output, {
          parser: "babel",
          plugins: plugins,
        });

        return [
          {
            range: model.getFullModelRange(),
            text: formatted,
          },
        ];
      },
    });

    monaco.languages.registerDocumentRangeFormattingEditProvider(
      { language: "javascript", exclusive: true },
      {
        provideDocumentRangeFormattingEdits(model, range, options) {
          const text = model.getValue();

          const formatted = prettierStandalone.format(text, {
            // parser: "babel",
            plugins: plugins,
          });

          return [
            {
              range: model.getFullModelRange(),
              text: formatted,
            },
          ];
        },
      }
    );

    editorRef.current = { editor: editor, monaco: monaco };

    checkFunction() && lint();

    publish("EDITOR_LOADING_COMPLETED", true);

    if (ref) ref.current = editor;
  }

  React.useEffect(() => {
    if (editorRef.current) {
      checkFunction() && lint();
    }
  }, [context, checkFunction, api, lint]);

  return (
    <Box sx={{ height: "100%" }}>
      <MonacoEditor
        height={"96%"}
        defaultLanguage="javascript"
        defaultValue={file.code}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        path={file.path}
        options={{
          minimap: {
            enabled: false,
          },
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
          },
          renderLineHighlightOnlyWhenFocus: true,
        }}
      />
      {!functions && (
        <OpenAI functions={context?.nucleoid?.functions} editor={editorRef} />
      )}
      <Backdrop open={open} />
    </Box>
  );
});

function getFile(context, props) {
  const { api, functions, query } = props;
  const file = { path: "", code: "" };

  if (api) {
    const selected = context.pages.api.selected;

    if (!selected) return file;

    file.path = selected?.path + selected?.method;
    file.code =
      context.nucleoid.api[selected?.path][selected?.method]["x-nuc-action"];
  }

  if (functions) {
    const selected = context.get("pages.functions.selected");

    if (!selected) return file;

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
