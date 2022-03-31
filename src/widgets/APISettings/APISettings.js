import EditIcon from "@mui/icons-material/Edit";
import ParamView from "../../components/ParamView";
import SchemaView from "../../components/SchemaView";
import Security from "../../components/Security";
import SummaryForm from "../../components/SummaryForm";
import styles from "./styles";

import { useNucleoidStore } from "../../Context/providers/NucleoidStoreProvider";
import { Fab, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";

function APISettings() {
  const [state, dispatch] = useNucleoidStore();
  const [method, setMethod] = useState();
  const [params, setParams] = useState();
  const [summary, setSummary] = useState();
  const [request, setRequest] = useState();
  const [response, setResponse] = useState();
  const [description, setDescription] = useState();

  const summaryRef = useRef([]);

  useEffect(() => {
    const selected = state.get("pages.api.selected");
    const api = state.get("nucleoid.api");

    if (selected) {
      setMethod(selected.method);
      setParams(api[selected.path][selected.method].params);
      setSummary(api[selected.path][selected.method].summary);
      setRequest(api[selected.path][selected.method].request);
      setResponse(api[selected.path][selected.method].response);
      setDescription(api[selected.path][selected.method].description);
    }
  }, [state]);

  return (
    <Grid container sx={styles.root}>
      <Grid
        container
        item
        xs={9}
        direction={"column"}
        justifyContent={"space-between"}
      >
        <Grid container sx={styles.content}>
          <Grid item xs={6} sx={styles.schema}>
            {method === "get" && <ParamView params={params} />}
            {method !== "get" && <SchemaView schema={request} />}
          </Grid>
          <Grid item xs={6} sx={styles.schema}>
            <SchemaView schema={response} />
          </Grid>
        </Grid>
      </Grid>
      <Grid container item xs={3} sx={styles.summaryFormRoot}>
        <SummaryForm
          summaryText={summary}
          descriptionText={description}
          ref={summaryRef}
        />
        <Security
          onClick={() => console.log(summaryRef.current["Summary"].value)}
        />
        <Grid container sx={styles.editIcon}>
          <Fab
            size={"small"}
            onClick={() => {
              dispatch({
                type: "OPEN_API_DIALOG",
                payload: { type: "method", action: "edit" },
              });
            }}
          >
            <EditIcon />
          </Fab>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default APISettings;
