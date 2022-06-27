import AceEditor from "react-ace";
import linter from "../../linter";
import prettier from "../../prettier";
import prettierPlugins from "../../prettierPlugins";
import rules from "./rules";
import shortcut from "./shortcuts";
import styles from "./styles";
import useService from "../../hooks/useService";
import { v4 as uuid } from "uuid";
import React, { useCallback, useEffect, useRef, useState } from "react";
// eslint-disable-next-line sort-imports
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-chrome";
import { addCompleter } from "ace-builds/src-noconflict/ext-language_tools";
import { parser } from "react-nucleoid";

function Editor({ name, api, functions, log, editorRef, ...other }) {
  const [state, , , saveProject] = useService();
  const [annotations, setAnnotations] = useState([]);
  const [code, setCode] = useState(null);
  const ace = useRef();
  const timer = useRef();

  const nucFuncs = state.nucleoid.functions;

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
  };

  const checkFunction = (value) => {
    try {
      parser.fn(value);
      setAnnotations([]);

      return true;
    } catch (err) {
      setAnnotations([
        {
          key: uuid(),
          row: 0,
          column: 1,
          text: err,
          type: "error",
        },
      ]);

      return false;
    }
  };

  addCompleter({
    getCompletions: function (editor, session, pos, prefix, callback) {
      callback(
        null,
        nucFuncs.map((item) => ({
          name: item.path.split("/").pop(),
          value: item.path.split("/").pop(),
          caption: item.path.split("/").pop(),
          meta: "Nucleoid",
          score: 1,
        }))
      );
    },
  });

  const lint = useCallback(
    (value) => {
      clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        const result = linter.verifyAndFix(value, options);

        setCode(result.output);

        setAnnotations([
          annotations,
          ...result.messages.map((item) => {
            return {
              row: item.line - 1,
              column: item.column,
              text: item.message,
              type: item.severity === 1 ? "error" : "warning",
            };
          }),
        ]);
      }, 1500);
    },
    //eslint-disable-next-line
    []
  );

  useEffect(() => {
    const { editor } = ace.current;
    if (editorRef) editorRef.current = editor;

    clearTimeout(timer.current);

    const handleSaveProject = () => {
      saveProject();
    };

    const prettyCode = () => {
      if (api) {
        const selected = state.get("pages.api.selected");
        const api = state.get("nucleoid.api");
        let action = api[selected.path][selected.method].action;

        try {
          action = prettier.format(action, {
            parser: "babel",
            plugins: prettierPlugins,
          });
        } catch (err) {
          console.log(err);
        }

        setCode(action);
      }

      if (functions) {
        const selected = state.get("pages.functions.selected");
        const functions = state.get("nucleoid.functions");
        let definition = functions.find(
          (item) => item.path === selected
        ).definition;

        try {
          definition = prettier.format(definition, {
            parser: "babel",
            plugins: prettierPlugins,
          });
        } catch (err) {
          console.log(err);
        }

        setCode(definition);

        return;
      }
    };

    editor.commands.addCommand({
      name: "save",
      bindKey: shortcut.save,
      exec: () => {
        prettyCode();
        handleSaveProject();
      },
    });

    editor.commands.addCommand({
      name: "pretty",
      bindKey: shortcut.pretty,
      exec: () => {
        prettyCode();
      },
    });

    setAnnotations([]);

    if (api) {
      const selected = state.get("pages.api.selected");
      const api = state.get("nucleoid.api");
      let action = api[selected.path][selected.method].action;

      if (checkFunction(action)) {
        const { args, fn } = parser.fn(action);

        if (fn[0] === "{" && fn[fn.length - 1] === "}") {
          action = fn.slice(1, -1);
        }

        action = `function action(${args[0] || ""}){\n\t${action}\n}`;

        lint(action);
      }
      setCode(action);

      return;
    }

    if (functions) {
      const selected = state.get("pages.functions.selected");
      const functions = state.get("nucleoid.functions");

      setCode(functions.find((item) => item.path === selected).definition);

      return;
    }

    setCode(log);
    //eslint-disable-next-line
  }, [state, api, functions, editorRef, log, lint]);

  return (
    <>
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
        onChange={(e) => {
          checkFunction(e) && lint(e);
          setCode(e);

          if (api) {
            const selected = state.get("pages.api.selected");
            const api = state.get("nucleoid.api");

            api[selected.path][selected.method].action = e;
          }

          if (functions) {
            const selected = state.get("pages.functions.selected");
            const functions = state.get("nucleoid.functions");

            functions.find((item) => item.path === selected).definition = e;
          }
        }}
      />
    </>
  );
}

export default React.forwardRef((props, ref) => (
  <Editor {...props} editorRef={ref} />
));
