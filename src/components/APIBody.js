import ParamView from "./ParamView";
import React from "react";
import Schema from "./Schema";
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

function APIBody({
  request,
  response,
  method,
  params,
  map,
  addSchemaProperty,
  removeSchemaProperty,
}) {
  const classes = useStyles();

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
          <Schema
            request
            edit
            schema={request}
            map={map}
            addSchemaProperty={addSchemaProperty}
            removeSchemaProperty={removeSchemaProperty}
          />
        )}
      </Grid>
      <Divider orientation={"vertical"} style={{ height: 350 }} />
      <Grid item className={classes.schema}>
        {response && (
          <Schema
            response
            edit
            schema={response}
            map={map}
            addSchemaProperty={addSchemaProperty}
            removeSchemaProperty={removeSchemaProperty}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default APIBody;
