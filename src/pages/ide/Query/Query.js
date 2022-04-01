import Editor from "../../../widgets/Editor";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
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
    service
      .query(editor ? editor.current.getValue() : null)
      .then((data) => {
        try {
          setResult(JSON.parse(data));
        } catch (error) {
          setResult(data);
        }
      })
      .catch((error) => setResult(error.message));
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
            return "table olcak";
          } else {
            return <QueryResult json={result.result} />;
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
