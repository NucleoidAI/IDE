import APIDialog from "../../../widgets/APIDialog";
import APISettings from "../../../widgets/APISettings";
import APITree from "../../../widgets/APITree";
import Editor from "../../../widgets/Editor";
import React from "react";
import styles from "./styles";
import { Card, Grid, Paper } from "@mui/material";
// eslint-disable-next-line

function API() {
  return (
    <Grid container sx={styles.root}>
      <APIDialog />
      <Grid item xs={3}>
        <APITree />
      </Grid>
      <Grid container item xs={9} sx={styles.content}>
        <Grid item xs={12} sx={styles.editorGrid}>
          <Paper sx={styles.editorPaper}>
            <Editor name={"api"} api />
          </Paper>
        </Grid>
        <Grid item xs={12} sx={styles.apiSettingsGrid}>
          <Card sx={{ height: "100%", padding: 1 }}>
            <APISettings />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default API;
