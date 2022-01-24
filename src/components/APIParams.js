import AddIcon from "@material-ui/icons/Add";
import ParamTable from "./ParamTable";
import React from "react";
import { Fab, Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
  params: {
    height: 350,
    margin: 8,
  },
}));

function APIParams({ params, addParam }) {
  const classes = useStyles();

  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"space-between"}
      className={classes.root}
    >
      <Grid item className={classes.params}>
        <ParamTable params={params} />
      </Grid>
      <Grid container item justifyContent="flex-end">
        <Fab size={"small"} onClick={() => addParam()}>
          <AddIcon />
        </Fab>
      </Grid>
    </Grid>
  );
}

export default APIParams;
