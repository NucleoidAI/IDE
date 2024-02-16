import Editor from "@monaco-editor/react";
import monacoDarkTheme from "../../lib/monacoEditorTheme.json";
import { useRef } from "react";
import { useStorage } from "@nucleoidjs/webstorage";

function CodeEditor({ onCodeEditorChange, setEditorRef }) {
  const editorRef = useRef(null);

  const [themeStorage] = useStorage("platform", "theme", "light");

  function editorOnMount(editor, monaco) {
    window.EditorInstance = editor;

    editorRef.current = { editor: editor, monaco: monaco };
    setEditorRef(editorRef.current);

    monaco.editor.defineTheme("custom-dark-theme", monacoDarkTheme);

    monaco.editor.setTheme(
      themeStorage === "light" ? "vs-light" : "custom-dark-theme"
    );
  }

  return (
    <Editor
      data-cy="codeEditor-editor"
      ref={editorRef}
      key={themeStorage}
      onChange={onCodeEditorChange}
      onMount={editorOnMount}
      height={"100%"}
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

export default CodeEditor;
