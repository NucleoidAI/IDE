import Editor from "../../components/Editor";
import IDE from "../../layouts/IDE";
import Moment from "react-moment";
import { makeStyles } from "@material-ui/core/styles";
import { v4 as uuid } from "uuid";
import { Grid, Paper, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  editor: {
    minHeight: 200,
    width: 500,
    margin: theme.spacing(3),
  },
}));

function Logs() {
  const classes = useStyles();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8448", {
      method: "POST",
      body: "Data.retrieve()",
    })
      .then((response) => response.text())
      .then((data) => {
        try {
          const string = atob(JSON.parse(data));
          setLogs(
            string
              .split("\n")
              .map((row) => row.trim())
              .filter((row) => row)
              .map((row) => JSON.parse(row))
          );
        } catch (error) {
          console.log(error);
        }
      });
  }, []);

  return (
    <IDE anchor={false}>
      <Grid container>
        <Grid container item justifyContent={"center"}>
          <Typography variant="h5" gutterBottom component="div">
            Logs
          </Typography>
        </Grid>
        <Grid
          container
          item
          direction={"column"}
          justifyContent={"flex-start"}
          alignContent={"center"}
        >
          {logs.map((log) => (
            <Paper key={uuid()} className={classes.editor}>
              <Editor name={"log"} log={log.s} readOnly />
              <Grid container justifyContent={"center"}>
                <Moment date={log.d} format="MM/DD hh:mm:ss" />{" "}
                &nbsp;&nbsp;-&nbsp;&nbsp;
                {log.t}ms
              </Grid>
            </Paper>
          ))}
        </Grid>
      </Grid>
    </IDE>
  );
}

export default Logs;
