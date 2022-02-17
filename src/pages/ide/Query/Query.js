import Editor from "../../../widgets/Editor";
import IDE from "../../../layouts/IDE";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QueryResult from "../../../components/QueryResult";
import service from "../../../service";
import styles from "./styles";

import {
  Card,
  Fab,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Switch,
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
    <IDE anchor={false}>
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
            <Grid container justifyContent={"flex-end"}>
              <FormGroup>
                <FormControlLabel control={<Switch />} label={"JSON"} checked />
              </FormGroup>
            </Grid>
            {typeof result === "object" && <QueryResult json={result} />}
            {typeof result !== "object" && <>{result}</>}
          </Card>
        </Grid>
      </Grid>
    </IDE>
  );
}

export default Query;
