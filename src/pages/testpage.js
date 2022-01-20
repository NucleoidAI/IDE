import { Grid } from "@material-ui/core";
import IDE from "../layouts/IDE";
import React from "react";

import EditableScrollList from "../components/EditableScrollList";

import { useContext } from "../context";

export default function TestPage() {
  const [state] = useContext();

  return (
    <IDE anchor={false}>
      <Grid item container spacing={2}>
        <Grid item md={6}>
          <TreeWidget editable={true} />
        </Grid>
        <Grid item md={6}>
          <TreeWidget editable={false} />
        </Grid>
        <Grid item md={12}>
          <button onClick={() => console.log(state)}>get state</button>
        </Grid>
      </Grid>
    </IDE>
  );
}
