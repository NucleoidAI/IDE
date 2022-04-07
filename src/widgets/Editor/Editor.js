import AceEditor from "react-ace";
import service from "../../service";
import styles from "./styles";
import { useContext } from "../../Context/providers/contextProvider";
import React, { useEffect, useRef, useState } from "react";

// eslint-disable-next-line sort-imports
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-chrome";
import { addCompleter } from "ace-builds/src-noconflict/ext-language_tools";
import { parser } from "react-nucleoid";

function Editor({ name, api, functions, log, editorRef, ...other }) {
  const [state] = useContext();
  const [annotations, setAnnotations] = useState([]);
  const [code, setCode] = useState(null);
  const ace = useRef();
  const timer = useRef();
  const abortController = useRef();
  const cursor = useRef();

  const nucFuncs = state.nucleoid.functions;

  addCompleter({
    getCompletions: function (editor, session, pos, prefix, callback) {
      callback(
        null,
        nucFuncs.map((item) => ({
          name: item.path.split("/").pop(),
          value: item.code,
          caption: item.path.split("/").pop(),
          meta: "nucleoid functions",
          score: 1,
        }))
      );
    },
  });

  const lint = (value) => {
    setCode(value);
    clearTimeout(timer.current);
    if (abortController.current) abortController.current.abort();

    timer.current = setTimeout(() => {
      abortController.current = new AbortController();

      service.lint(value, abortController.current.signal).then((result) => {
        abortController.current = null;

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
  };

  useEffect(() => {
    const { editor } = ace.current;
    if (editorRef) editorRef.current = editor;

    if (api) {
      const selected = state.get("pages.api.selected");
      const api = state.get("nucleoid.api");
      const { action, cursor } = api[selected.path][selected.method];

      editor.selection.moveCursorToPosition({
        row: cursor?.row || 0,
        column: cursor?.column || 0,
      });

      setCode(action);
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
      cursorStart={cursor.current}
      onCursorChange={(e) =>
        (cursor.current = { row: e.cursor.row, column: e.cursor.column })
      }
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
      onChange={lint}
      onBlur={() => {
        if (api) {
          const selected = state.get("pages.api.selected");
          const api = state.get("nucleoid.api");
          api[selected.path][selected.method].action = code;
          api[selected.path][selected.method].cursor = cursor.current;
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
