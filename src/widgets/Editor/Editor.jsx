import MonacoEditor from "@monaco-editor/react";
import OpenAI from "../OpenAI";
import { contextToMap } from "../../utils/Parser";
import monacoDarkTheme from "../../lib/monacoEditorTheme.json";
import { parser } from "react-nucleoid";
import { publish } from "@nucleoidjs/react-event";
import rules from "./rules";
import { useContext } from "../../context/context";
import { useStorage } from "@nucleoidjs/webstorage";

import { Backdrop, Box } from "@mui/material";
import React, { useCallback } from "react";

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

  const [themeStorage] = useStorage("platform", "theme", "light");

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
      const endpointIndex = context.nucleoid.api.findIndex(
        (endpoint) =>
          endpoint.path === selected.path &&
          endpoint.method.toLowerCase() === selected.method.toLowerCase()
      );
      if (endpointIndex !== -1) {
        context.nucleoid.api[endpointIndex]["x-nuc-action"] = e;
      }
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
      key = context.get("pages.functions.selected") + ".ts";
    }

    publish("CONTEXT_CHANGED", {
      // TODO Optimize preparing files
      files: contextToMap(context.nucleoid).filter((item) => item.key === key),
    });
  }, [api, context]);

  function getLineAndColumn(text, position) {
    const textUpToPosition = text.slice(0, position);
    const line = textUpToPosition.split("\n").length;
    const column = position - textUpToPosition.lastIndexOf("\n");
    return { line, column };
  }

  const lint = React.useCallback(async () => {
    const editor = editorRef?.current?.editor;
    const monaco = editorRef?.current?.monaco;
    const worker = await monaco.languages.typescript.getTypeScriptWorker();
    const ts = await worker(editor.getModel().uri);
    const diagnostics = await ts.getSemanticDiagnostics(
      editor.getModel().uri.toString()
    );
    const text = editor.getValue();

    const markers = diagnostics.map((diagnostic) => {
      const start = getLineAndColumn(text, diagnostic.start);
      const end = getLineAndColumn(text, diagnostic.start + diagnostic.length);
      const severity =
        diagnostic.category === 1
          ? monaco.MarkerSeverity.Warning
          : monaco.MarkerSeverity.Error;

      return {
        startLineNumber: start.line,
        startColumn: start.column,
        endLineNumber: end.line,
        endColumn: end.column,
        message: diagnostic.messageText,
        severity: severity,
      };
    });

    monaco.editor.setModelMarkers(editor.getModel(), "action", markers);
  }, []);

  function handleEditorDidMount(editor, monaco) {
    const nucFuncs = context.nucleoid.functions;

    monaco.editor.defineTheme("custom-dark-theme", monacoDarkTheme);

    monaco.editor.setTheme(
      themeStorage === "light" ? "vs-light" : "custom-dark-theme"
    );

    options.globals = {};
    nucFuncs.forEach((item) => {
      const pth = monaco.Uri.from({ path: item.path });
      options.globals[item.path.split("/")[1]] = "writable";

      if (!monaco.editor.getModel(pth)) {
        monaco.editor.createModel(
          item.definition,
          item.ext === "js" ? "javascript" : "typescript",
          pth
        );
      }
    });

    editor.addAction({
      id: "saveEvent",
      label: "Save Project",
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS),
      ],

      run: () => {
        setOpen(true);
        // TODO SAVE PROJECT
      },
    });

    monaco.languages.registerDocumentFormattingEditProvider("typescript", {
      provideDocumentFormattingEdits(model) {
        const text = model.getValue();

        const formatted = prettierStandalone.format(text, {
          parser: "typescript",
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
      { language: "typescript", exclusive: true },
      {
        provideDocumentRangeFormattingEdits(model) {
          const text = model.getValue();

          const formatted = prettierStandalone.format(text, {
            parser: "typescript",
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

  const clearModels = useCallback(() => {
    const { monaco, editor } = editorRef?.current || {};
    const currentModel = editor?.getModel();
    const NucFunctions = context.nucleoid.functions;

    const functionModels = monaco?.editor
      .getModels()
      .filter((model) =>
        NucFunctions.some(
          (nucFunc) => model._associatedResource.path === nucFunc.path
        )
      );

    monaco?.editor.getModels().forEach((model) => {
      const isNotFunctionModel = !functionModels?.includes(model);
      const isNotCurrentModel =
        currentModel.uri.toString() !== model.uri.toString();
      if (isNotFunctionModel && isNotCurrentModel) {
        model.dispose();
      }
    });
  }, [context.nucleoid.functions, editorRef]);

  React.useEffect(() => {
    if (editorRef.current) {
      checkFunction() && lint();
      clearModels();
    }
  }, [context, checkFunction, api, lint, clearModels]);

  return (
    <Box sx={{ height: "100%" }}>
      <MonacoEditor
        key={themeStorage}
        height={"96%"}
        defaultLanguage="typescript"
        defaultValue={file.code}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        path={file.path}
        options={{
          tabSize: 2,
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

    const apiConfig = context.nucleoid.api.find(
      (endpoint) =>
        endpoint.path === selected?.path && endpoint.method === selected?.method
    );

    if (!apiConfig) return file;

    file.path = selected?.path + selected?.method;

    file.code = apiConfig["x-nuc-action"];
  }

  if (functions) {
    const selected = context.get("pages.functions.selected");

    if (!selected) return file;

    file.path = selected;
    const functionItem = context.nucleoid.functions.find(
      (item) => item.path === selected
    );

    if (!functionItem) return file;

    file.code = functionItem.definition;
  }

  if (query) {
    console.log("query");
  }

  return file;
}

export default Editor;
