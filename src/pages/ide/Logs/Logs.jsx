import BlankLayout from "../../../layouts/BlankLayout";
import Page from "../../../components/Page";
import moment from "moment";
import { publish } from "@nucleoidai/react-event";
import service from "../../../service";
import styles from "./styles";
import { useEvent } from "@nucleoidai/react-event";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { CircularProgress, Grid, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [runtimeConnection] = useEvent("RUNTIME_CONNECTION");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!runtimeConnection) {
      navigate("/");
    }
  }, [runtimeConnection, navigate]);

  useEffect(() => {
    setLoading(true);
    service.logs().then((logs) => {
      setLogs([...logs.slice(0, 25)]);
      setLoading(false);
      publish("PAGE_LOADED", { name: "Logs" });
    });
  }, []);

  return (
    <Page title={"Logs"}>
      <BlankLayout
        logs={
          loading ? (
            <CircularProgress />
          ) : (
            logs.map((log) => (
              <Paper key={uuid()} sx={styles.logitem}>
                <TextField
                  variant={"outlined"}
                  fullWidth
                  inputProps={{ style: { fontFamily: "monospace" } }}
                  multiline
                  value={log.s.trim()}
                />
                <Grid container justifyContent={"center"} sx={{ mt: 1 }}>
                  {moment(log.d).format("MM/DD hh:mm:ss")}
                  &nbsp;&nbsp;-&nbsp;&nbsp;
                  {log.t}ms
                </Grid>
              </Paper>
            ))
          )
        }
      />
    </Page>
  );
}

export default Logs;
