import monacoDarkTheme from "../../lib/monacoEditorTheme.json";
import { useStorage } from "@nucleoidjs/webstorage";

import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

function CodeEditor({ onCodeEditorChange, generatedCode }) {
  const editorRef = useRef(null);
  const monaco = useMonaco();

  const [themeStorage] = useStorage("platform", "theme", "light");

  function editorOnMount(editor, monaco) {
    editorRef.current = editor;

    monaco.editor.defineTheme("custom-dark-theme", monacoDarkTheme);

    monaco.editor.setTheme(
      themeStorage === "light" ? "vs-light" : "custom-dark-theme"
    );
  }

  useEffect(() => {
    if (generatedCode !== "") {
      setModel();
    }
  }, [generatedCode]);

  function setModel() {
    const model = monaco.editor.createModel(generatedCode, "typescript");
    editorRef.current.setModel(model);
  }

  return (
    <Editor
      key={themeStorage}
      onChange={(e) => onCodeEditorChange(e)}
      onMount={editorOnMount}
      height={"300px"}
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
      }}
    />
  );
}

export default CodeEditor;
