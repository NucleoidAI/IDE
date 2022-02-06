import ParamView from "./ParamView";
import Schema from "./Schema";
import { Divider, Grid, makeStyles } from "@material-ui/core";
import React, { forwardRef } from "react";

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

const APIBody = forwardRef(({ method, params }, { request, response }) => {
  const classes = useStyles();

  return (
    <Grid container justifyContent={"space-between"} className={classes.root}>
      <Grid item className={classes.schema}>
        {method === "get" && (
          <>
            <br />
            <ParamView params={params} />
          </>
        )}
        {method !== "get" && <Schema request ref={request} />}
      </Grid>
      <Divider orientation={"vertical"} style={{ height: 350 }} />
      <Grid item className={classes.schema}>
        <Schema response ref={response} />
      </Grid>
    </Grid>
  );
});

export default APIBody;
