import { Grid } from "@mui/material";
import React from "react";

function BlankLayout({ content }) {
  return (
    <Grid container>
      <Grid
        container
        item
        direction={"column"}
        justifyContent={"flex-start"}
        alignContent={"center"}
      >
        {content}
      </Grid>
    </Grid>
  );
}

export default BlankLayout;
