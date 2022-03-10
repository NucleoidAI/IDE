import AceEditor from "react-ace";
import service from "../../service";
import styles from "./styles";
import { useStore } from "../../store";
import React, { useEffect, useRef, useState } from "react";

// eslint-disable-next-line sort-imports
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-chrome";
import { addCompleter } from "ace-builds/src-noconflict/ext-language_tools";

function Editor({ name, api, functions, log, editorRef, ...other }) {
  const [state] = useStore();
  const [annotations, setAnnotations] = useState([]);
  const [code, setCode] = useState(null);
  const ace = useRef();
  let timer = null;

  const nucfunctions = state.nucleoid.functions;

  addCompleter({
    getCompletions: function (editor, session, pos, prefix, callback) {
      callback(
        null,
        nucfunctions.map((item) => {
          return {
            name: item.path.split("/").pop(),
            value: item.code,
            caption: item.path.split("/").pop(),
            meta: "nucleoid functions",
            score: 1,
          };
        })
      );
    },
  });

  function checkEditorService(value) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      service.checkFormat(value).then((result) => {
        setCode(result.output);
        setAnnotations(
          result.messages.map((item) => {
            return {
              row: item.line - 1,
              column: item.column,
              text: item.message,
              type: item.severity === 1 ? "error" : "warning",
            };
          })
        );
      });
    }, 1500);
  }

  useEffect(() => {
    const { editor } = ace.current;
    if (editorRef) editorRef.current = editor;

    editor.selection.moveCursorToPosition({ row: 0, column: 0 });
    if (api) {
      const selected = state.get("pages.api.selected");
      const api = state.get("nucleoid.api");
      const action = api[selected.path][selected.method].action;
      setCode(`function ${selected.method}(query, json) {\n  ${action}\n}`);
      return;
    }

    if (functions) {
      const selected = state.get("pages.functions.selected");
      const functions = state.get("nucleoid.functions");
      setCode(functions.find((item) => item.path === selected).code);

      return;
    }

    setCode(log);
  }, [state, api, functions, editorRef, log]);

  return (
    <AceEditor
      ref={ace}
      style={styles.editor}
      name={name}
      mode={"javascript"}
      theme={"chrome"}
      annotations={annotations}
      fontSize={14}
      {...other}
      setOptions={{
        useWorker: false,
        tabSize: 2,
        useSoftTabs: true,
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true,
      }}
      value={code}
      onChange={checkEditorService}
      onBlur={() => {
        if (api) {
          const selected = state.get("pages.api.selected");
          const api = state.get("nucleoid.api");
          api[selected.path][selected.method].action = code;
        }

        if (functions) {
          const selected = state.get("pages.functions.selected");
          const functions = state.get("nucleoid.functions");
          functions.find((item) => item.path === selected).code = code;
        }
      }}
    />
  );
}

export default React.forwardRef((props, ref) => (
  <Editor {...props} editorRef={ref} />
));
