import AddList from "../../components/AddList";
import Editor from "../../widgets/Editor";
import FunctionTree from "../../widgets/FunctionTree";
import IDE from "../../layouts/IDE";
import React from "react";
import { Card, CardActions, CardContent, Grid, Paper } from "@mui/material";

function Functions() {
  return (
    <IDE>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Card
            sx={{
              height: (theme) => window.innerHeight - theme.spacing(1) * 2 - 1,
            }}
          >
            <CardContent>
              <FunctionTree />
            </CardContent>
            <CardActions>
              <AddList list={["Folder", "|", "Class", "Function"]} />
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Paper
            sx={{
              height: (theme) => window.innerHeight - theme.spacing(1) * 2 - 1,
            }}
          >
            <Editor name={"functions"} functions />
          </Paper>
        </Grid>
      </Grid>
    </IDE>
  );
}

export default Functions;
