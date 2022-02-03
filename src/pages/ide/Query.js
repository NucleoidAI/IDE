import Editor from "../../widgets/Editor";
import IDE from "../../layouts/IDE";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QueryResult from "../../components/QueryResult";
import makeStyles from "@mui/styles/makeStyles";
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

const useStyles = makeStyles((theme) => {
  const ratio = 0.5;
  const height = window.innerHeight - parseInt(theme.spacing()) * 2 - 1;

  return {
    editor: {
      height: height * ratio - parseInt(theme.spacing()) / 2,
    },
    results: {
      height: height * (1 - ratio) - parseInt(theme.spacing()) / 2,
      justifyContent: "flex-start",
      paddingLeft: parseInt(theme.spacing()) * 2,
    },
    process: {
      position: "absolute",
      top: parseInt(theme.spacing()) * 2,
      right: parseInt(theme.spacing()) * 2,
    },
    run: {
      position: "relative",
      bottom: 40 + parseInt(theme.spacing()),
      right: parseInt(theme.spacing()),
    },
    popupIndicator: {
      "& span": {
        "& svg": {
          "& path": { fill: "#212121" },
        },
      },
    },
  };
});

function Query() {
  const classes = useStyles();
  const [result, setResult] = useState();
  const editor = useRef();

  useEffect(() => {
    editor.current.commands.addCommand({
      name: "query",
      bindKey: { win: "Ctrl-Enter", mac: "Ctrl-Enter" },
      exec: () => {
        query();
      },
    });
  }, []);

  const query = () => {
    fetch("http://localhost:8448", {
      method: "POST",
      body: editor ? editor.current.getValue() : null,
    })
      .then((response) => response.text())
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
          <Paper className={classes.editor}>
            <Editor name={"query"} ref={editor} />
            <Grid
              container
              item
              className={classes.run}
              justifyContent={"flex-end"}
            >
              <Fab size={"small"} onClick={() => query()}>
                <PlayArrowIcon
                  style={{
                    fill: "#212121",
                  }}
                />
              </Fab>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Card className={classes.results}>
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
