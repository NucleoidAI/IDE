import EditIcon from "@mui/icons-material/Edit";
import ParamView from "../components/ParamView";
import SchemaView from "../components/SchemaView";
import Security from "../components/Security";
import SummaryForm from "../components/SummaryForm";
import { useContext } from "../context";
import { Fab, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";

function APISettings() {
  const [state, dispatch] = useContext();
  const [method, setMethod] = useState();
  const [params, setParams] = useState();
  const [summary, setSummary] = useState();
  const [description, setDescription] = useState();

  const summaryRef = useRef([]);

  useEffect(() => {
    const selected = state.get("pages.api.selected");
    const api = state.get("nucleoid.api");

    if (selected) {
      setMethod(selected.method);
      setParams(api[selected.path][selected.method].params);
      setSummary(api[selected.path][selected.method].summary);
      setDescription(api[selected.path][selected.method].description);
    }
  }, [state]);

  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      <Grid
        container
        item
        xs={9}
        direction={"column"}
        justifyContent={"space-between"}
      >
        <Grid container sx={{ padding: 1 }}>
          <Grid item xs={6} sx={{ height: 200, overflow: "auto" }}>
            {method === "get" && <ParamView params={params} />}
            {method !== "get" && <SchemaView />}
          </Grid>
          <Grid item xs={6} sx={{ height: 200, overflow: "auto" }}>
            <SchemaView />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs={3}
        direction={"column"}
        justifyContent={"space-between"}
      >
        <SummaryForm
          summaryText={summary}
          descriptionText={description}
          ref={summaryRef}
        />
        <Security
          onClick={() => console.log(summaryRef.current["Summary"].value)}
        />
        <Grid container justifyContent={"flex-end"}>
          <Fab
            size={"small"}
            onClick={() => {
              dispatch({ type: "OPEN_API_DIALOG" });
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
