import Editor from "../../../widgets/Editor";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QueryArrayTable from "../../../components/QueryArrayTable";
import QueryResult from "../../../components/QueryResult";
import service from "../../../service";
import styles from "./styles";

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
  const [result, setResult] = useState();
  const editor = useRef();
  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    editor.current.commands.addCommand({
      name: "query",
      bindKey: { win: "Ctrl-Enter", mac: "Ctrl-Enter" },
      exec: () => {
        handleQuery();
      },
    });
  }, []);

  const handleQuery = () => {
    setLoading(true);
    service
      .query(editor ? editor.current.getValue() : null)
      .then((data) => {
        try {
          setResult(JSON.parse(data));
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setResult(data);
        }
      })
      .catch((error) => {
        setLoading(false);
        setResult(error.message);
      });
  };

  return (
    <>
      <Grid container sx={styles.root}>
        <Grid item xs={12} sx={styles.editorGrid}>
          <Paper sx={styles.editorPaper}>
            <Editor name={"query"} ref={editor} />
            <Grid container item sx={styles.runButton}>
              <Fab size={"small"} onClick={() => handleQuery()}>
                <PlayArrowIcon style={styles.playArrowIcon} />
              </Fab>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sx={styles.contentGrid}>
          {loading && (
            <Card sx={styles.loadingCard}>
              <LinearProgress color="inherit" />
            </Card>
          )}
          {!loading && (
            <Card sx={styles.contentCard}>
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
              {!result && <Typography variant="h7">Console output</Typography>}
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
