import React from "react";
import styles from "./styles";

import { Grid, Paper } from "@mui/material";

function HorizontalSplitLayout({
  queryEditor,
  playArrowIcon,
  querys,
  outputRatio,
}) {
  return (
    <Grid container sx={styles.root}>
      <Grid
        item
        xs={12}
        sx={{
          ...styles.editorGrid,
          height: 1 - outputRatio,
        }}
      >
        <Paper sx={styles.editorPaper}>
          {queryEditor}
          <Grid container item sx={styles.runButton}>
            {playArrowIcon}
          </Grid>
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          ...styles.contentGrid,
          height: outputRatio,
        }}
      >
        {querys}
      </Grid>
    </Grid>
  );
}

export default HorizontalSplitLayout;
