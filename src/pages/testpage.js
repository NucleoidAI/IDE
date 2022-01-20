import { Grid } from "@material-ui/core";
import IDE from "../layouts/IDE";
import React from "react";
import TreeView from "../widgets/TreeView";

import { useContext } from "../context";

export default function TestPage() {
  const [state] = useContext();

  return (
    <IDE anchor={false}>
      <Grid item container spacing={2}>
        <Grid item md={6}>
          <TreeView editable={true} />
        </Grid>
        <Grid item md={6}>
          <TreeView editable={false} />
        </Grid>
        <Grid item md={12}>
          <button onClick={() => console.log(state)}>Get state</button>
        </Grid>
      </Grid>
    </IDE>
  );
}
