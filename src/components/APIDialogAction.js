import { Context } from "../context";
import { Button, Grid } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

function APIDialogAction({ view, setApiDialogView, saveApiDialog }) {
  const [alignment, setAlignment] = React.useState();

  useEffect(() => {
    setAlignment(view);
  }, [view]);

  return (
    <Grid container justifyContent={"space-between"}>
      <Grid style={{ width: 50 }} />
      <Grid item>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          size={"small"}
          onChange={(event, newAlignment) => {
            if (!newAlignment) return;
            setAlignment(newAlignment);
            setApiDialogView(newAlignment);
          }}
        >
          <ToggleButton
            color={"primary"}
            variant={"contained"}
            value={"PARAMS"}
          >
            Params
          </ToggleButton>
          <ToggleButton color={"primary"} variant={"contained"} value={"BODY"}>
            &nbsp;Body&nbsp;
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Button
        variant={"text"}
        color={"primary"}
        onClick={() => saveApiDialog()}
      >
        Save
      </Button>
    </Grid>
  );
}

export default APIDialogAction;
