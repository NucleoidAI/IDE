import Moment from "react-moment";
import service from "../../../service";
import styles from "./styles";
import { v4 as uuid } from "uuid";
import {
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    service.logs().then((logs) => {
      setLogs([...logs.slice(0, 25)]);
      setLoading(false);
    });
  }, []);

  return (
    <>
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
          {loading && <CircularProgress />}
          {logs.map((log) => (
            <Paper key={uuid()} sx={styles.logitem}>
              <TextField
                fullWidth
                inputProps={{ style: { fontFamily: "monospace" } }}
                multiline
                value={log.s}
              />
              <Grid container justifyContent={"center"}>
                <Moment date={log.d} format="MM/DD hh:mm:ss" />{" "}
                &nbsp;&nbsp;-&nbsp;&nbsp;
                {log.t}ms
              </Grid>
            </Paper>
          ))}
        </Grid>
      </Grid>
    </>
  );
}

export default Logs;
