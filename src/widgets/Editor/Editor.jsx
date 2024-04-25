/* eslint-disable */

import AIDialog from "../AIDialog/AIDialog";
import NucEditor from "../../components/NucEditor/NucEditor";
import Path from "../../utils/Path";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QueryAIButton from "../../components/QueryAIButton";
import sandboxService from "../../sandboxService";
import service from "../../service";
import { storage } from "@nucleoidjs/webstorage";
import styles from "../../layouts/HorizontalSplitLayout/styles";
import { useContext } from "../../context/context";
import { useMonaco } from "@monaco-editor/react";
import { v4 as uuidv4 } from "uuid";

import { CircularProgress, Fab, Grid } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { publish, useEvent } from "@nucleoidai/react-event";

const Editor = React.forwardRef((props, ref) => {
  const monaco = useMonaco();
  const editorRef = React.useRef(null);
  const [logicPath, setLogicPath] = React.useState("");
  const [queryPath, setQueryPath] = React.useState("");
  const mode = Path.getMode();
  const [context, distpach] = useContext();
  const { setLoading, logic, query, loading } = props;
  const [selected] = useEvent("LOGIC_SELECTED", null);
  const nucFuncs = context.specification.functions;
  const logics = context.specification.declarations;

  useEffect(() => {
    if (query) {
      setTimeout(() => {
        if (editorRef?.current) {
          editorRef.current.editor.focus();
          editorRef.current.editor.setValue(context.get("pages.query.text"));
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

          const query = context.get("pages.query");
          editorRef.current?.editor.onKeyUp(() => {
            query.text = editorRef?.current?.editor.getValue();
          });
        }
      }, 1);
    }
    //eslint-disable-next-line
  }, []);

  const handleQuery = () => {
    setLoading(true);
    sandboxService
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
    editorRef.current = { editor: editor, monaco: monaco };
    let currentDefiniton;
    if (logic) {
      setLogicModel();
    }

    if (query) {
      addFunctionsModels();
      setQueryModel();
      publish("WIDGET_LOADED", { name: "Editor" });
    }
  }

  const setLogicModel = useCallback(() => {
    const { monaco, editor } = editorRef?.current;
    let currentDefiniton;
    if (monaco) {
      if (selected) {
        monaco.editor.getModels().forEach((model) => model.dispose());
        currentDefiniton = selected.logic.definition?.trim();
        const uniquePath = `/tmp/${uuidv4()}.ts`;
        const model = monaco?.editor.createModel(
          currentDefiniton,
          "typescript",
          monaco.Uri.file(uniquePath)
        );
        editorRef.current?.editor.setModel(model);
        setLogicPath(uniquePath);
      } else {
        monaco.editor.getModels().forEach((model) => model.dispose());
        const uniquePath = `/tmp/${uuidv4()}.ts`;
        const declaration = logics[0];
        const model = monaco?.editor.createModel(
          declaration.definition,
          "typescript",
          monaco.Uri.file(uniquePath)
        );
        editorRef.current?.editor.setModel(model);
        setLogicPath(uniquePath);
      }
    }
  }, [selected, monaco?.editor, editorRef]);

  const setQueryModel = useCallback(() => {
    const uniquePath = `/tmp/${uuidv4()}.ts`;
    const model = monaco?.editor.createModel(
      context.get("pages.query.text"),
      "javascript",
      monaco.Uri.file(uniquePath)
    );
    editorRef.current?.editor.setModel(model);
    setQueryPath(uniquePath);
  }, [monaco?.editor, editorRef, context]);

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedSave = debounce((id, specification, project) => {
    if (mode === "cloud") {
      service.saveContext(id, specification);
    } else if (mode === "local") {
      storage.set("ide", "context", id, {
        specification,
        project,
      });
    } else if (mode === "terminal") {
      console.log("Terminal mode is not supported yet.");
    }

    publish("CONTEXT_SAVED", { contextId: id, to: mode });
  }, 300);

  function handleChange(e) {
    if (logic) {
      const {
        project: { id },
      } = context;

      context.specification.declarations =
        context.specification.declarations.map((item) => {
          if (selected.logic) {
            if (item.summary === selected.logic.summary) {
              return { ...item, definition: e };
            }
          }
          return item;
        });

      debouncedSave(id, context.specification, context.project);
    }
    if (query) {
      context.pages.query.text = e;
    }
  }

  console.debug("Current Query:" + context?.pages?.query?.text);

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
    if (editorRef.current && logic && selected.logic) {
      setLogicModel();
    }
    if (editorRef.current && query) {
      setQueryModel();
    }
  }, [selected, context, logic, query, setLogicModel, setQueryModel]);
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
          {!loading && (
            <Fab variant="button" size={"small"} onClick={() => handleQuery()}>
              <PlayArrowIcon />
            </Fab>
          )}
          {loading && <CircularProgress />}
        </Grid>
      )}
    </>
  );
});

export default Editor;
