import MonacoEditor from "@monaco-editor/react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import React from "react";
import service from "../..../../../service";
import styles from "../../layouts/HorizontalSplitLayout/styles";
import { useContext } from "../../context/context";
import { useEffect } from "react";
import { useMonaco } from "@monaco-editor/react";

import { Fab, Grid } from "@mui/material";

const QueryEditor = React.forwardRef((props, ref) => {
  const monaco = useMonaco();

  const [state, distpach] = useContext();
  const { setLoading } = props;

  useEffect(() => {
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
  return (
    <>
      <MonacoEditor
        height={"100%"}
        defaultLanguage="javascript"
        onMount={(editor) => (ref.current = editor)}
        options={{
          minimap: {
            enabled: false,
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
