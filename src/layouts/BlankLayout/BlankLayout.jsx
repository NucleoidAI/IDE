import { Grid } from "@mui/material";
import React from "react";

function BlankLayout({ logs }) {
  return (
    <Grid container>
      <Grid
        container
        item
        direction={"column"}
        justifyContent={"flex-start"}
        alignContent={"center"}
      >
        {logs}
      </Grid>
    </Grid>
  );
}

export default BlankLayout;
