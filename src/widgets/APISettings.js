import EditIcon from "@material-ui/icons/Edit";
import ParamView from "../components/ParamView";
import SchemaView from "../components/SchemaView";
import Security from "../components/Security";
import SummaryForm from "../components/SummaryForm";
import { makeStyles } from "@material-ui/core/styles";
import { useContext } from "../context";
import { Fab, Grid } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  schema: {
    padding: theme.spacing(1),
  },
  schemas: {
    height: 199,
    overflow: "auto",
  },
}));

function APISettings() {
  const [state, dispatch] = useContext();
  const [method, setMethod] = useState();
  const [params, setParams] = useState();
  const [summary, setSummary] = useState();
  const [description, setDescription] = useState();

  const summaryRef = useRef([]);

  const classes = useStyles();

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
    <Grid container className={classes.root}>
      <Grid
        container
        item
        xs={9}
        direction={"column"}
        justifyContent={"space-between"}
      >
        <Grid container className={classes.schemas}>
          <Grid item xs={6} className={classes.schema}>
            {method === "get" && <ParamView params={params} />}
            {method !== "get" && <SchemaView />}
          </Grid>
          <Grid item xs={6} className={classes.schema}>
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
