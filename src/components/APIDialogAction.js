import { Context } from "../context";
import { Button, Grid } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

function APIDialogAction() {
  const [state, dispatch] = useContext(Context);
  const [alignment, setAlignment] = React.useState();

  useEffect(() => {
    setAlignment(state.get("pages.api.dialog.view"));
  }, [state]);

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
            dispatch({
              type: "SET_API_DIALOG_VIEW",
              payload: { view: newAlignment },
            });
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
        onClick={() => {
          dispatch({ type: "SAVE_API_DIALOG" });
        }}
      >
        Save
      </Button>
    </Grid>
  );
}

export default APIDialogAction;
