import BlankLayout from "../../../layouts/BlankLayout";
import Page from "../../../components/Page";
import ReadOnlyEditor from "../../../components/ReadOnlyEditor";
import moment from "moment";
import { publish } from "@nucleoidai/react-event";
import sandboxService from "../../../sandboxService";
import { useEvent } from "@nucleoidai/react-event";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { Box, CircularProgress, Grid } from "@mui/material";
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
    sandboxService.get("logs").then((logs) => {
      setLogs([...logs.slice(0, 25)]);
      setLoading(false);
      publish("PAGE_LOADED", { name: "Logs" });
    });
  }, []);

  return (
    <Page title={"Logs"}>
      <BlankLayout
        content={
          loading ? (
            <CircularProgress />
          ) : (
            logs.map((log) => (
              <Box
                component="pre"
                key={uuid()}
                sx={{
                  overflowX: "auto",
                  justifyContent: "center",
                  marginTop: "8px",
                  borderRadius: "5px",
                  padding: "0",
                  userSelect: "text",
                  width: "50%",
                }}
              >
                <ReadOnlyEditor
                  title={"Log"}
                  value={
                    log.s ? log.s : `No code was provided for this log entry.`
                  }
                  language="typescript"
                  isCollapsed={false}
                />
                <Grid container justifyContent={"center"} sx={{ mt: 1 }}>
                  {moment(log.d).format("MM/DD hh:mm:ss")}
                  &nbsp;&nbsp;-&nbsp;&nbsp;
                  {log.t}ms
                </Grid>
              </Box>
            ))
          )
        }
      />
    </Page>
  );
}

export default Logs;
