import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QueryArrayTable from "../../../components/QueryArrayTable";
import QueryEditor from "../../../widgets/QueryEditor";
import QueryResult from "../../../components/QueryResult";
import RatioIconButtons from "../../../components/RatioIconButtons/RatioIconButtons";
import service from "../../../service";
import styles from "./styles";
import { useContext } from "../../../context/context";
import { useMonaco } from "@monaco-editor/react";
import {
  Box,
  Card,
  Fab,
  FormControlLabel,
  FormGroup,
  Grid,
  LinearProgress,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

function Query() {
  const [state, distpach] = useContext();
  const result = state.get("pages.query.results");
  const [outputRatio, setOutputRatio] = React.useState(
    state.get("pages.query.outputRatio")
  );
  const editorRef = useRef(null);

  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(false);

  const monaco = useMonaco();

  useEffect(() => {
    setTimeout(() => {
      editorRef?.current?.focus();
      editorRef?.current?.setValue(state.get("pages.query.text"));
      editorRef?.current?.setPosition({ lineNumber: 1, column: 1000 });
      editorRef?.current?.addAction({
        id: "lintEvent",
        label: "lintEvent",
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter),
        ],

        run: (e) => handleQuery(),
      });
    }, 1);

    /*  editor.current.on("change", () => {
      query.text = editor.current.getValue();
    });
     */
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

  const handleSetOutputRatio = (ratio) => {
    const query = state.get("pages.query");
    query.outputRatio = ratio;
    setOutputRatio(ratio);
  };

  return (
    <>
      <Grid container sx={styles.root}>
        <Grid
          item
          xs={12}
          sx={{
            ...styles.editorGrid,
            height: 1 - outputRatio,
          }}
        >
          <Paper sx={styles.editorPaper}>
            <QueryEditor ref={editorRef} />
            <Grid container item sx={styles.runButton}>
              <Fab size={"small"} onClick={() => handleQuery()}>
                <PlayArrowIcon style={styles.playArrowIcon} />
              </Fab>
            </Grid>
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            ...styles.contentGrid,
            height: outputRatio,
          }}
        >
          {loading && (
            <Card sx={styles.loadingCard}>
              <LinearProgress color="inherit" />
            </Card>
          )}
          {!loading && (
            <Card sx={styles.contentCard}>
              <RatioIconButtons
                handleSetOutputRatio={handleSetOutputRatio}
                outputRatio={outputRatio}
              />
              <Box sx={styles.jsonSwitch}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={checked}
                        onChange={() => setChecked(!checked)}
                      />
                    }
                    label={"JSON"}
                  />
                </FormGroup>
                {result && (
                  <Typography variant="h7">time :{result.time} ms</Typography>
                )}
              </Box>
              {ResultTypes(result, checked)}
              {!result && (
                <Box sx={styles.consoleOutput}>
                  <Typography variant="h7">Console output</Typography>
                </Box>
              )}
            </Card>
          )}
        </Grid>
      </Grid>
    </>
  );
}

const ResultTypes = (result, isTable) => {
  if (typeof result === "object") {
    switch (typeof result.result) {
      case "object":
        if (Array.isArray(result.result)) {
          if (isTable) {
            return <QueryResult json={result.result} />;
          } else {
            return <QueryArrayTable json={result.result} />;
          }
        } else {
          return <QueryResult json={result.result} />;
        }
      default:
        return result.result;
    }
  } else {
    return <>{result}</>;
  }
};

export default Query;
