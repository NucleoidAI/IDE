import APIDialog from "../../../widgets/APIDialog";
import APISettings from "../../../widgets/APISettings";
import APITree from "../../../widgets/APITree";
import AddList from "../../../components/AddList";
import Editor from "../../../widgets/Editor";
import IDE from "../../../layouts/IDE";
import React from "react";
import styles from "./styles";
import { Card, CardActions, CardContent, Grid, Paper } from "@mui/material";
// eslint-disable-next-line
import { Context } from "../../../context";

function API() {
  const dispatch = React.useContext(Context)[1];

  function openApiDialog(item) {
    dispatch({
      type: "OPEN_API_DIALOG",
      payload: { type: "add" },
    });
  }

  return (
    <IDE>
      <APIDialog />
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Card sx={styles.sidemenucard}>
            <CardContent>
              <APITree />
            </CardContent>
            <CardActions>
              <AddList
                list={["Resource", "Method"]}
                clickEvent={openApiDialog}
              />
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Paper sx={styles.editor}>
                <Editor name={"api"} api />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Card sx={styles.settings}>
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
