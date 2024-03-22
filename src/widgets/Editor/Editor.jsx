/* eslint-disable */

import AIDialog from "../AIDialog/AIDialog";
import NucEditor from "../../components/NucEditor/NucEditor";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QueryAIButton from "../../components/QueryAIButton";
import { publish } from "@nucleoidjs/react-event";
import service from "../../service";
import styles from "../../layouts/HorizontalSplitLayout/styles";
import { useContext } from "../../context/context";
import { useMonaco } from "@monaco-editor/react";
import { v4 as uuidv4 } from "uuid";

import { CircularProgress, Fab, Grid } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

const Editor = React.forwardRef((props, ref) => {
  const monaco = useMonaco();
  const editorRef = React.useRef(null);
  const [logicPath, setLogicPath] = React.useState("");
  const [queryPath, setQueryPath] = React.useState("");

  const [state, distpach] = useContext();
  const { setLoading, logic, query, loading } = props;
  const selectedLogic = state.get("pages.logic.selected");
  const nucFuncs = state.nucleoid.functions;

  useEffect(() => {
    if (query) {
      setTimeout(() => {
        if (editorRef?.current) {
          editorRef.current.editor.focus();
          editorRef.current.editor.setValue(state.get("pages.query.text"));
          editorRef.current.editor.setPosition({ lineNumber: 1, column: 1000 });
          editorRef.current.editor.addAction({
            id: "lintEvent",
            label: "lintEvent",
            keybindings: [
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
              monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter),
            ],
            run: () => handleQuery(),
          });

          const query = state.get("pages.query");
          editorRef?.current.editor.onKeyUp(() => {
            query.text = editorRef?.current?.editor.getValue();
          });
        }
      }, 1);
    }
    //eslint-disable-next-line
  }, []);

  const handleQuery = () => {
    setLoading(true);
    service
      .query(editorRef ? editorRef.current.editor.getValue() : null)
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
      addFunctionsModels();
      setQueryModel();
    }

    publish("WIDGET_LOADED", { name: "Editor" });
  }

  const setLogicModel = useCallback(() => {
    if (selectedLogic && monaco?.editor) {
      monaco?.editor.getModels().forEach((model) => model.dispose());
      const definition = selectedLogic.definition?.trim();
      const uniquePath = `/tmp/${uuidv4()}.ts`;
      const model = monaco?.editor.createModel(
        definition,
        "typescript",
        monaco.Uri.file(uniquePath)
      );
      editorRef?.current.editor.setModel(model);
      setLogicPath(uniquePath);
    }
  }, [selectedLogic, monaco?.editor, editorRef]);

  const setQueryModel = useCallback(() => {
    const uniquePath = `/tmp/${uuidv4()}.ts`;
    const model = monaco?.editor.createModel(
      state.get("pages.query.text"),
      "javascript",
      monaco.Uri.file(uniquePath)
    );
    editorRef?.current.editor.setModel(model);
    setQueryPath(uniquePath);
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

  console.debug("Current Query:" + state?.pages?.query?.text);

  const addFunctionsModels = () => {
    nucFuncs.forEach((item) => {
      if (!monaco?.editor.getModel(monaco.Uri.file(item.path))) {
        monaco?.editor.createModel(
          item.definition,
          "typescript",
          monaco.Uri.file(item.path)
        );
      }
    });
  };

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
        path={logic ? logicPath : queryPath}
        onCodeEditorChange={handleChange}
        setEditorRef={editorRef}
        ref={ref}
      />
      {query && (
        <Grid container item sx={styles.runButton}>
          <QueryAIButton />
          <AIDialog imperative page={"query"} editor={editorRef} />
          <Fab
            variant="button"
            hide={loading}
            size={"small"}
            onClick={() => handleQuery()}
          >
            <PlayArrowIcon />
          </Fab>
          <CircularProgress show={loading} />
        </Grid>
      )}
    </>
  );
});

export default Editor;
