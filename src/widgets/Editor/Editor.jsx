/* eslint-disable */

import AIDialog from "../AIDialog/AIDialog";
import NucEditor from "../../components/NucEditor/NucEditor";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QueryAIButton from "../../components/QueryAIButton";
import service from "../../service";
import styles from "../../layouts/HorizontalSplitLayout/styles";
import { useContext } from "../../context/context";
import { useMonaco } from "@monaco-editor/react";

import { Fab, Grid } from "@mui/material";
import React, { useCallback, useEffect } from "react";

const Editor = React.forwardRef((props, ref) => {
  const monaco = useMonaco();
  const editorRef = React.useRef(null);

  const [state, distpach] = useContext();
  const { setLoading, logic, query } = props;
  const selectedLogic = state.get("pages.logic.selected");

  useEffect(() => {
    if (query) {
      setTimeout(() => {
        if (editorRef?.current) {
          editorRef.current.focus();
          editorRef.current.setValue(state.get("pages.query.text"));
          editorRef.current.setPosition({ lineNumber: 1, column: 1000 });
          editorRef.current.addAction({
            id: "lintEvent",
            label: "lintEvent",
            keybindings: [
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
              monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter),
            ],
            run: () => handleQuery(),
          });

          const query = state.get("pages.query");
          editorRef?.current.onKeyUp(() => {
            query.text = editorRef?.current?.getValue();
          });
        }
      }, 1);
    }
    //eslint-disable-next-line
  }, []);

  const handleQuery = () => {
    setLoading(true);
    service
      .query(editorRef ? editorRef.current.getValue() : null)
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
    editorRef.current = { editor, monaco };

    if (logic) {
      setLogicModel(editor, monaco);
    }

    if (query) {
      setQueryModel();
    }
  }

  const setLogicModel = useCallback(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose());
    const definition = selectedLogic.definition.trim();
    const model = monaco?.editor.createModel(definition, "typescript");
    editorRef?.current.editor.setModel(model);
  }, [selectedLogic, monaco?.editor, editorRef]);

  const setQueryModel = useCallback(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose());
    const model = monaco?.editor.createModel(
      state.get("pages.query.text"),
      "typescript"
    );
    editorRef?.current.setModel(model);
  }, [monaco?.editor, editorRef, state]);

  function handleChange(e) {
    if (logic) {
      state.nucleoid.declarations = state.nucleoid.declarations.map((item) => {
        if (item.summary === selectedLogic?.summary) {
          return { ...item, definition: e };
        }
        return item;
      });
    }
    if (query) {
      state.pages.query.text = e;
    }
  }

  React.useEffect(() => {
    if (editorRef.current && logic) {
      setLogicModel();
    }
    if (editorRef.current && query) {
      setQueryModel();
    }
  }, [state, logic, query, setLogicModel, setQueryModel]);

  return (
    <>
      <NucEditor
        onMount={editorOnMount}
        onCodeEditorChange={handleChange}
        setEditorRef={editorRef}
      />
      <Grid container item sx={styles.runButton}>
        <QueryAIButton />
        <AIDialog imperative page={"query"} editor={editorRef} />
        <Fab size={"small"} onClick={() => handleQuery()}>
          <PlayArrowIcon style={styles.playArrowIcon} />
        </Fab>
      </Grid>
    </>
  );
});

export default Editor;
