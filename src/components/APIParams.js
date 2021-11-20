import AddIcon from "@material-ui/icons/Add";
import ParamTable from "./ParamTable";
import React from "react";
import { useContext } from "../context";
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

function APIParams() {
  const classes = useStyles();
  const [state, dispatch] = useContext();
  const params = state.get("pages.api.dialog.params");

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
        <Fab size={"small"} onClick={() => dispatch({ type: "ADD_PARAM" })}>
          <AddIcon />
        </Fab>
      </Grid>
    </Grid>
  );
}

export default APIParams;
