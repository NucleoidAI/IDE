import MonacoEditor from "@monaco-editor/react";
import monacoDarkTheme from "../../lib/monacoEditorTheme.json";
import { useStorage } from "@nucleoidjs/webstorage";
import { v4 as uuidv4 } from "uuid";

import React, { useEffect, useState } from "react";

const ChatEditor = ({ code, readOnly }) => {
  const [editorHeight, setEditorHeight] = useState("100%");
  const [themeStorage] = useStorage("platform", "theme", "light");

  function handleEditorDidMount(editor, monaco) {
    monaco.editor.defineTheme("custom-dark-theme", monacoDarkTheme);

    monaco.editor.setTheme(
      themeStorage === "light" ? "vs-light" : "custom-dark-theme"
    );
  }
  useEffect(() => {
    const calculateInitialHeight = (code) => {
      const lineCount = code.split("\n").length;
      const lineHeight = 18;
      const paddingLines = 2;
      const calculatedHeight = lineHeight * (lineCount + paddingLines);
      return `${calculatedHeight}px`;
    };

    const initialHeight = calculateInitialHeight(code);
    setEditorHeight(initialHeight);
  }, [code]);

  const options = {
    readOnly: readOnly,
    minimap: { enabled: false },
    scrollbar: {
      vertical: "hidden",
      horizontal: "hidden",
    },
    lineNumbers: "on",
    automaticLayout: true,
    tabSize: 2,
  };

  return (
    <MonacoEditor
      key={`themeStorage-${uuidv4()}`}
      height={editorHeight}
      defaultLanguage="typescript"
      onMount={handleEditorDidMount}
      defaultValue={code}
      options={options}
      theme="vs-dark"
    />
  );
};
export default ChatEditor;
