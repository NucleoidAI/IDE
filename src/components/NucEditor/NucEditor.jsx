import Editor from "@monaco-editor/react";
import { NucLinter } from "./NucLinter";
import React from "react";
import monacoDarkTheme from "../../lib/monacoEditorTheme.json";
import { useStorage } from "@nucleoidjs/webstorage";

import { useEffect, useRef } from "react";

import * as prettierStandalone from "prettier/standalone";
import * as typescriptPlugin from "prettier/parser-typescript";

const NucEditor = React.forwardRef((props, ref) => {
  const { onCodeEditorChange, defaultValue, path, onMount, onSave } = props;

  const plugins = [typescriptPlugin];
  const editorRef = useRef(null);
  const timerRef = React.useRef();

  const [themeStorage] = useStorage("platform", "theme", "light");

  function getLineAndColumn(text, position) {
    const textUpToPosition = text.slice(0, position);
    const line = textUpToPosition.split("\n").length;
    const column = position - textUpToPosition.lastIndexOf("\n");
    return { line, column };
  }

  const lintWithCustomLinter = async () => {
    const editor = editorRef?.current?.editor;
    const monaco = editorRef?.current?.monaco;

    const code = editor.getValue();
    const linter = new NucLinter(code);
    const diagnostics = linter.lint();

    const markers = diagnostics.map((diagnostic) => {
      const { line, column } = getLineAndColumn(code, diagnostic.index);
      return {
        startLineNumber: line,
        startColumn: column,
        endLineNumber: line,
        endColumn: column + diagnostic.length,
        message: diagnostic.message,
        severity:
          diagnostic.severity === "error"
            ? monaco.MarkerSeverity.Error
            : monaco.MarkerSeverity.Warning,
      };
    });

    monaco.editor.setModelMarkers(editor.getModel(), "customLinting", markers);
  };

  const formatDocument = () => {
    const editor = editorRef.current?.editor;
    if (editor) {
      editor.getAction("editor.action.formatDocument").run();
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      formatDocument();
    }
  }, [path]);

  function editorOnMount(editor, monaco) {
    window.EditorInstance = editor;

    editorRef.current = { editor: editor, monaco: monaco };

    if (!editor.getModel()) {
      editor.setValue("");
    }

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
    });

    monaco.languages.registerDocumentFormattingEditProvider("typescript", {
      provideDocumentFormattingEdits(model) {
        const text = model.getValue();

        const formatted = prettierStandalone.format(text, {
          parser: "typescript",
          plugins: plugins,
          singleQuote: true,
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

    editor.addAction({
      id: "saveEvent",
      label: "Save Project",
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS),
      ],

      run: () => {
        onSave && onSave(editor.getValue());
        editorRef.current && formatDocument();
      },
    });
    const model = editor.getModel();
    if (model.uri.path !== "/empty") {
      lintWithCustomLinter();
      formatDocument();
    }
    onMount && onMount(editor, monaco);
  }

  const beforeMount = (monaco) => {
    monaco.editor.defineTheme("custom-dark-theme", monacoDarkTheme);
  };

  function handleChange(e) {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      lintWithCustomLinter();
    }, 400);

    onSave && onSave(e);

    onCodeEditorChange && onCodeEditorChange(e);
  }

  return (
    <Editor
      ref={ref}
      key={themeStorage}
      theme={themeStorage === "light" ? "vs-light" : "custom-dark-theme"}
      defaultValue={defaultValue}
      path={path || "empty"}
      onChange={handleChange}
      onMount={editorOnMount}
      beforeMount={beforeMount}
      height={"96%"}
      defaultLanguage="typescript"
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
        selectOnLineNumbers: true,
      }}
    />
  );
});

export default NucEditor;
