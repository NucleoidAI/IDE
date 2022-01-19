import { Grid } from "@material-ui/core";
import IDE from "../layouts/IDE";
import React from "react";
import TreeWidget from "../widgets/TreeWidget";

export default function TestPage() {
  return (
    <IDE anchor={false}>
      <Grid item container spacing={2}>
        <Grid item md={6}>
          <TreeWidget editable={true} />
        </Grid>
        <Grid item md={6}>
          <TreeWidget editable={false} />
        </Grid>
      </Grid>
    </IDE>
  );
}
