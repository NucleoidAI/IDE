import ParamView from "./ParamView";
import React from "react";
import Schema from "./Schema";
import { useContext } from "../context";
import { Divider, Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  schema: {
    height: "100%",
    width: 400,
    margin: 8,
  },
}));

function APIBody() {
  const classes = useStyles();
  const [state] = useContext();
  const { method } = state.get("pages.api.selected");
  const request = state.get("pages.api.dialog.request");
  const response = state.get("pages.api.dialog.response");

  const selected = state.get("pages.api.selected");
  const api = state.get("nucleoid.api");
  const params = api[selected.path][selected.method].params;

  return (
    <Grid container justifyContent={"space-between"} className={classes.root}>
      <Grid item className={classes.schema}>
        {request && method === "get" && (
          <>
            <br />
            <ParamView params={params} />
          </>
        )}
        {request && method !== "get" && (
          <Schema request edit schema={request} />
        )}
      </Grid>
      <Divider orientation={"vertical"} style={{ height: 350 }} />
      <Grid item className={classes.schema}>
        {response && <Schema response edit schema={response} />}
      </Grid>
    </Grid>
  );
}

export default APIBody;
