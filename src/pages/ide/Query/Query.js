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

/*
    editor: {
      height: height * ratio - theme.spacing(1) / 2,
    },
    results: {
      height: height * (1 - ratio) - theme.spacing(1) / 2,
      justifyContent: "flex-start",
      paddingLeft: theme.spacing(1) * 2,
    },
    process: {
      position: "absolute",
      top: theme.spacing(1) * 2,
      right: theme.spacing(1) * 2,
    },
    run: {
      position: "relative",
      bottom: 40 + theme.spacing(1),
      right: theme.spacing(1),
    },
    popupIndicator: {
      "& span": {
        "& svg": {
          "& path": { fill: "#212121" },
        },
      },
    },

*/

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
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper sx={styles.editor}>
            <Editor name={"query"} ref={editor} />
            <Grid container item sx={styles.run}>
              <Fab size={"small"} onClick={() => handleQuery()}>
                <PlayArrowIcon style={styles.playArrowIcon} />
              </Fab>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          {loading && (
            <Box
              sx={{
                width: "100%",
                marginTop: 25,
              }}
            >
              <LinearProgress color="inherit" />
            </Box>
          )}
          {!loading && (
            <Card sx={styles.results}>
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
                {result && <Typography>time :{result.time} ms</Typography>}
              </Box>
              {ResultTypes(result, checked)}
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
