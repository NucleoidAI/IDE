import DirectoryTree from "components/DirectoryTree";

import { Grid, Paper } from "@mui/material";
import React, { useEffect } from "react";

const style = { height: 300, width: 300 };

function Dev() {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Paper
        sx={{
          bgcolor: "background.default",
          width: "100%",
          height: "100vh",
          borderRadius: "2",
        }}
      >
        <DirectoryTree />
      </Paper>
    </Grid>
  );
}

export default Dev;
