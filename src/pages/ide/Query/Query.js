import Editor from "../../../widgets/Editor";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QueryArrayTable from "../../../components/QueryArrayTable";
import QueryResult from "../../../components/QueryResult";
import RatioIconButtons from "../../../components/RatioIconButtons/RatioIconButtons";
import config from "../../../config";
import service from "../../../service";
import styles from "./styles";
import { useContext } from "../../../Context/providers/contextProvider";
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
  const editor = useRef();
  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(false);

  if (
    config.layout.query.outputRatio() === undefined ||
    config.layout.query.outputRatio() === null
  ) {
    config.layout.query.outputRatio(0.5);
  }

  const [outputRatio, setOutputRatio] = React.useState(
    config.layout.query.outputRatio()
  );

  useEffect(() => {
    const query = state.get("pages.query");
    editor.current.on("change", () => {
      query.text = editor.current.getValue();
    });

    editor.current.setValue(state.get("pages.query.text"));

    editor.current.commands.addCommand({
      name: "query",
      bindKey: { win: "Ctrl-Enter", mac: "Ctrl-Enter" },
      exec: () => {
        handleQuery();
      },
    });

    //eslint-disable-next-line
  }, []);

  const handleQuery = () => {
    setLoading(true);
    service
      .query(editor ? editor.current.getValue() : null)
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
    config.layout.query.outputRatio(ratio);
    setOutputRatio(config.layout.query.outputRatio());
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
            <Editor name={"query"} ref={editor} />
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
