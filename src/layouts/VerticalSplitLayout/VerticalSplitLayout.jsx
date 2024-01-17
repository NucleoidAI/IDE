import React from "react";
import config from "../../config";
import styles from "./styles";

import { Card, Grid, Paper } from "@mui/material";

function VerticalSplitLayout({ dialog, content1, content2, content3 }) {
  return (
    <Grid container sx={styles.root} columns={config.layout.ide.total}>
      {dialog}
      <Grid
        item
        xs={config.layout.ide.tree.xs}
        sm={config.layout.ide.tree.sm}
        md={config.layout.ide.tree.md}
        lg={config.layout.ide.tree.lg}
        xl={config.layout.ide.tree.xl}
      >
        {content1}
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
        <Grid
          item
          xs={12}
          sx={
            content3
              ? styles.threeContentEditorGrid
              : styles.twoContentEditorGrid
          }
        >
          <Paper sx={styles.editorPaper}>{content2}</Paper>
        </Grid>
        {content3 && (
          <Grid item xs={12} sx={styles.apiSettingsGrid}>
            <Card sx={{ height: "100%", padding: 1 }}>{content3}</Card>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default VerticalSplitLayout;
