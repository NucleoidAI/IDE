import AddIcon from "@material-ui/icons/Add";
import ParamTable from "./ParamTable";
import { forwardRef } from "react";
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

const APIParams = forwardRef((props, paramsRef) => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"space-between"}
      className={classes.root}
    >
      <Grid item className={classes.params}>
        <ParamTable ref={paramsRef} />
      </Grid>
      <Grid container item justifyContent="flex-end">
        {/* TODO Move add icon into ParamTable */}
        <Fab size={"small"}>
          <AddIcon />
        </Fab>
      </Grid>
    </Grid>
  );
});

export default APIParams;
