import EditIcon from "@material-ui/icons/Edit";
import ParamView from "../components/ParamView";
import Schema from "../components/Schema";
import Security from "../components/Security";
import { makeStyles } from "@material-ui/core/styles";
import { useContext } from "../context";
import { Fab, Grid, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";

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
  const [request, setRequest] = useState({});
  const [response, setResponse] = useState({});
  const [params, setParams] = useState();

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const classes = useStyles();

  useEffect(() => {
    console.log(state);

    const selected = state.get("pages.api.selected");
    const api = state.get("nucleoid.api");

    if (selected) {
      setMethod(selected.method);
      setRequest(api[selected.path][selected.method].request);
      setResponse(api[selected.path][selected.method].response);
      setParams(api[selected.path][selected.method].params);
      setSummary(api[selected.path][selected.method].summary);
      setDescription(api[selected.path][selected.method].description);
    }
  }, [state, method]);

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
            {method !== "get" && <Schema request schema={request} />}
          </Grid>
          <Grid item xs={6} className={classes.schema}>
            <Schema response schema={response} />
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
        <form style={{ marginLeft: 24, marginRight: 24 }}>
          <TextField
            label={"Summary"}
            fullWidth
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
          <TextField
            label={"Description"}
            multiline
            fullWidth
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </form>
        <Security />
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
