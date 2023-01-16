import APIDialog from "../../../widgets/APIDialog";
import APISettings from "../../../widgets/APISettings";
import APITree from "../../../widgets/APITree";
import Editor from "../../../widgets/Editor";
import React from "react";
import config from "../../../config";
import styles from "./styles";
import { Card, Grid, Paper } from "@mui/material";

function API() {
  return (
    <Grid container sx={styles.root} columns={config.layout.ide.total}>
      <APIDialog />
      <Grid
        item
        xs={config.layout.ide.tree.xs}
        sm={config.layout.ide.tree.sm}
        md={config.layout.ide.tree.md}
        lg={config.layout.ide.tree.lg}
        xl={config.layout.ide.tree.xl}
      >
        <APITree />
      </Grid>
      <Grid
        container
        item
        xs={config.layout.ide.tree.xs}
        sm={config.layout.ide.content.sm}
        md={config.layout.ide.content.md}
        lg={config.layout.ide.content.lg}
        xl={config.layout.ide.content.xl}
        sx={styles.content}
      >
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
