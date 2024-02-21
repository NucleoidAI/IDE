import Editor from "@monaco-editor/react";
import React from "react";
import monacoDarkTheme from "../../lib/monacoEditorTheme.json";
import { useStorage } from "@nucleoidjs/webstorage";

import { useEffect, useRef } from "react";

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

function NucEditor({ onCodeEditorChange, defaultValue, path, onMount }) {
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
  const editorRef = useRef(null);
  const timerRef = React.useRef();

  const [themeStorage] = useStorage("platform", "theme", "light");

  function getLineAndColumn(text, position) {
    const textUpToPosition = text.slice(0, position);
    const line = textUpToPosition.split("\n").length;
    const column = position - textUpToPosition.lastIndexOf("\n");
    return { line, column };
  }

  const lint = React.useCallback(async () => {
    const editor = editorRef?.current?.editor;
    const monaco = editorRef?.current?.monaco;
    if (editor.getModel()) {
      const worker = await monaco.languages.typescript.getTypeScriptWorker();
      const ts = await worker(editor.getModel().uri);
      const diagnostics = await ts.getSemanticDiagnostics(
        editor.getModel().uri.toString()
      );
      const text = editor.getValue();

      const markers = diagnostics.map((diagnostic) => {
        const start = getLineAndColumn(text, diagnostic.start);
        const end = getLineAndColumn(
          text,
          diagnostic.start + diagnostic.length
        );
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
    }
  }, []);

  useEffect(() => {
    const formatDocument = () => {
      const editor = editorRef.current?.editor;
      if (editor) {
        editor.getAction("editor.action.formatDocument").run();
      }
    };

    if (editorRef.current) {
      formatDocument();
    }
  }, [path]);

  function editorOnMount(editor, monaco) {
    window.EditorInstance = editor;

    editorRef.current = { editor: editor, monaco: monaco };

    monaco.editor.defineTheme("custom-dark-theme", monacoDarkTheme);

    monaco.editor.setTheme(
      themeStorage === "light" ? "vs-light" : "custom-dark-theme"
    );

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

    lint();
    onMount && onMount(editor, monaco);
  }

  function handleChange(e) {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      lint();
    }, 400);

    onCodeEditorChange && onCodeEditorChange(e);
  }

  return (
    <Editor
      data-cy="codeEditor-editor"
      ref={editorRef}
      key={themeStorage}
      defaultValue={defaultValue}
      path={path}
      onChange={handleChange}
      onMount={editorOnMount}
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
}

export default NucEditor;
