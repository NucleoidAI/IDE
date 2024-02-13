import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import monacoDarkTheme from "../../lib/monacoEditorTheme.json";
import service from "../..../../../service";
import styles from "../../layouts/HorizontalSplitLayout/styles";
import { useContext } from "../../context/context";
import { useStorage } from "@nucleoidjs/webstorage";

import { Fab, Grid } from "@mui/material";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import React, { useCallback, useEffect, useRef } from "react";

const QueryEditor = React.forwardRef((props, ref) => {
  const monaco = useMonaco();
  const editorRef = useRef(null);

  const [themeStorage] = useStorage("platform", "theme", "light");

  const [state, distpach] = useContext();
  const { setLoading, logic, query } = props;
  const selectedLogic = state.get("pages.logic.selected");

  useEffect(() => {
    if (query) {
      setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
          ref.current.setValue(state.get("pages.query.text"));
          ref.current.setPosition({ lineNumber: 1, column: 1000 });
          ref.current.addAction({
            id: "lintEvent",
            label: "lintEvent",
            keybindings: [
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
              monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter),
            ],
            run: () => handleQuery(),
          });

          const query = state.get("pages.query");
          ref.current.onKeyUp(() => {
            query.text = ref.current.getValue();
          });
        }
      }, 1);
    }
    //eslint-disable-next-line
  }, []);

  const handleQuery = () => {
    setLoading(true);
    service
      .query(ref ? ref.current.getValue() : null)
      .then((data) => {
        try {
          distpach({
            type: "QUERY_RESULTS",
            payload: { results: data },
          });
          setLoading(false);
        } catch (error) {
          setLoading(false);
          distpach({
            type: "QUERY_RESULTS",
            payload: { results: data },
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        distpach({
          type: "QUERY_RESULTS",
          payload: { results: error.message },
        });
      });
  };
  function editorOnMount(editor, monaco) {
    editorRef.current = editor;

    monaco.editor.defineTheme("custom-dark-theme", monacoDarkTheme);

    monaco.editor.setTheme(
      themeStorage === "light" ? "vs-light" : "custom-dark-theme"
    );

    if (logic) {
      setModel();
    }
  }

  const setModel = useCallback(() => {
    monaco.editor.getModels().forEach((model) => model.dispose());
    const definition = selectedLogic.definition.trim().slice(1, -1);
    const model = monaco.editor.createModel(definition, "typescript");
    editorRef.current.setModel(model);
  }, [selectedLogic, monaco.editor, editorRef]);

  function handleChange(e) {
    if (logic) {
      state.nucleoid.declarations = state.nucleoid.declarations.map((item) => {
        if (item.summary === selectedLogic?.summary) {
          return { ...item, definition: `{${e}}` };
        }
        return item;
      });
    }
  }

  React.useEffect(() => {
    if (editorRef.current) {
      setModel();
    }
  }, [state, logic, setModel]);

  return (
    <>
      <MonacoEditor
        key={themeStorage}
        height={"100%"}
        defaultLanguage="typescript"
        onMount={editorOnMount}
        onChange={handleChange}
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
      <Grid container item sx={styles.runButton}>
        <Fab size={"small"} onClick={() => handleQuery()}>
          <PlayArrowIcon style={styles.playArrowIcon} />
        </Fab>
      </Grid>
    </>
  );
});

export default QueryEditor;
