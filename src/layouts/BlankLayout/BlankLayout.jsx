import React from "react";

import { Box, Grid } from "@mui/material";

function BlankLayout({ content }) {
  return (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      <Grid
        container
        item
        direction={"column"}
        justifyContent={"flex-start"}
        alignContent={"center"}
      >
        {content}
      </Grid>
    </Box>
  );
}

export default BlankLayout;
