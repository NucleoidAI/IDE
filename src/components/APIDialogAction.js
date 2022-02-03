import { Button, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

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
