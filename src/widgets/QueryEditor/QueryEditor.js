import MonacoEditor from "@monaco-editor/react";
import React from "react";

const QueryEditor = React.forwardRef((props, ref) => {
  return (
    <MonacoEditor
      height={"100%"}
      defaultLanguage="javascript"
      onMount={(editor, monaco) => (ref.current = editor)}
      options={{
        minimap: {
          enabled: false,
        },
      }}
    />
  );
});

export default QueryEditor;
