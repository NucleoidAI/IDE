import APIDialog from "../../components/APIDialog";
import APISettings from "../../widgets/APISettings";
import APITree from "../../widgets/APITree";
import AddList from "../../components/AddList";
import Editor from "../../widgets/Editor";
import IDE from "../../layouts/IDE";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardActions, CardContent, Grid, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  const ratio = 0.65;
  const height = window.innerHeight - theme.spacing() * 2 - 1;

  return {
    tree: {
      height,
    },
    editor: {
      height: height * ratio - theme.spacing() / 2,
    },
    settings: {
      height: height * (1 - ratio) - theme.spacing() / 2,
      padding: theme.spacing(),
    },
  };
});

function API() {
  const classes = useStyles();

  return (
    <IDE>
      <APIDialog />
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Card className={classes.tree}>
            <CardContent>
              <APITree />
            </CardContent>
            <CardActions>
              <AddList list={["Resource", "Method"]} type={"OPEN_API_DIALOG"} />
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Paper className={classes.editor}>
                <Editor name={"api"} api />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Card className={classes.settings}>
                <APISettings />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </IDE>
  );
}

export default API;
