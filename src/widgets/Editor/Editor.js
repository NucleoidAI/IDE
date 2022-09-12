import AceEditor from "react-ace";
import Event from "Event";
import Settings from "../../settings";
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
import { contextToMap } from "utils/Parser";
import { parser } from "react-nucleoid";
import { Backdrop, CircularProgress } from "@mui/material";

function Editor({ name, api, functions, log, editorRef, ...other }) {
  const [state, , , saveProject] = useService();
  const [backdrop, setBackdrop] = React.useState(false);
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
        const result = linter.verify(value, options);

        setAnnotations([
          annotations,
          ...result.map((item) => {
            return {
              row: item.line - 1,
              column: item.column,
              text: item.message,
              type: item.severity === 1 ? "error" : "warning",
            };
          }),
        ]);
      }, 1000);
    },
    //eslint-disable-next-line
    []
  );

  useEffect(() => {
    const { editor } = ace.current;
    if (editorRef) editorRef.current = editor;

    clearTimeout(timer.current);

    const handleSaveProject = () => {
      setBackdrop(true);

      saveProject(() => {
        setBackdrop(false);
      });
    };

    const prettyCode = () => {
      clearTimeout(timer.current);
      setAnnotations([]);
      if (api) {
        const selected = state.get("pages.api.selected");
        const api = state.get("nucleoid.api");
        const action = api[selected.path][selected.method]["x-nuc-action"];
        const result = linter.verifyAndFix(action, options);

        try {
          const prettyText = prettier.format(result.output, {
            parser: "babel",
            plugins: prettierPlugins,
          });

          setCode(
            (api[selected.path][selected.method]["x-nuc-action"] = prettyText)
          );

          lint(prettyText);
        } catch (err) {
          console.log(err);
        }
      }

      if (functions) {
        const selected = state.get("pages.functions.selected");
        const functions = state.get("nucleoid.functions");
        const definition = functions.find(
          (item) => item.path === selected
        ).definition;
        const result = linter.verifyAndFix(definition, options);

        try {
          const prettyText = prettier.format(result.output, {
            parser: "babel",
            plugins: prettierPlugins,
          });

          setCode(
            (functions.find((item) => item.path === selected).definition =
              prettyText)
          );

          lint(prettyText);
        } catch (err) {
          console.log(err);
        }
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
    const selectedApi = state.get("pages.api.selected");
    if (api && selectedApi) {
      const api = state.get("nucleoid.api");
      let action = api[selectedApi.path][selectedApi.method]["x-nuc-action"];

      if (checkFunction(action)) {
        const { args, fn } = parser.fn(action);

        if (fn[0] === "{" && fn[fn.length - 1] === "}") {
          action = fn.slice(1, -1);
        }

        action = `function action(${args[0] || ""}) {\n  ${action}\n}\n`;

        lint(action);
      }
      setCode(action);

      return;
    }
    const selectedFunction = state.get("pages.functions.selected");
    if (functions && selectedFunction) {
      const functions = state.get("nucleoid.functions");

      lint(functions.find((item) => item.path === selectedFunction).definition);

      setCode(
        functions.find((item) => item.path === selectedFunction).definition
      );
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
        onBlur={() => {
          if (Settings.beta()) {
            let key;
            if (name === "api") {
              const { path, method } = state.get("pages.api.selected");
              key = path + "." + method + ".ts";
            } else {
              key = state.get("pages.functions.selected") + ".js";
            }

            Event.publish("CONTEXT_CHANGED", {
              files: contextToMap(state.nucleoid).filter(
                (item) => item.key === key
              ),
            }).then();
          }
        }}
        onChange={(e) => {
          setCode(e);

          if (api) {
            checkFunction(e) && lint(e);

            const selected = state.get("pages.api.selected");
            const api = state.get("nucleoid.api");

            api[selected.path][selected.method]["x-nuc-action"] = e;
          }

          if (functions) {
            lint(e);

            const selected = state.get("pages.functions.selected");
            const functions = state.get("nucleoid.functions");

            functions.find((item) => item.path === selected).definition = e;
          }
        }}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default React.forwardRef((props, ref) => (
  <Editor {...props} editorRef={ref} />
));
