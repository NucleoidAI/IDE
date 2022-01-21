import AddList from "../../components/AddList";
import Editor from "../../widgets/Editor";
import FunctionTree from "../../components/FunctionTree";
import IDE from "../../layouts/IDE";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardActions, CardContent, Grid, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: window.innerHeight - theme.spacing() * 2 - 1,
  },
}));

function Functions() {
  const classes = useStyles();

  return (
    <IDE>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Card className={classes.paper}>
            <CardContent>
              <FunctionTree />
            </CardContent>
            <CardActions>
              <AddList list={["Folder", "|", "Class", "Function"]} />
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Paper className={classes.paper}>
            <Editor name={"functions"} functions />
          </Paper>
        </Grid>
      </Grid>
    </IDE>
  );
}

export default Functions;
