import React from "react";
import styles from "./styles";

import { Grid, Paper } from "@mui/material";

function HorizontalSplitLayout({ topSection, bottomSection, outputRatio }) {
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
        <Paper sx={styles.editorPaper}>{topSection}</Paper>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          ...styles.contentGrid,
          height: outputRatio,
        }}
      >
        {bottomSection}
      </Grid>
    </Grid>
  );
}

export default HorizontalSplitLayout;
