import AddIcon from "@mui/icons-material/Add";
import ParamTable from "./ParamTable";
import { forwardRef } from "react";
import { Fab, Grid } from "@mui/material";

const APIParams = forwardRef((props, paramsRef) => {
  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"space-between"}
      sx={{ height: "100%" }}
    >
      <Grid item sx={{ margin: 2, height: 350 }}>
        <ParamTable ref={paramsRef} />
      </Grid>
      <Grid container item justifyContent="flex-end">
        {/* TODO Move add icon into ParamTable */}
        <Fab size={"small"}>
          <AddIcon />
        </Fab>
      </Grid>
    </Grid>
  );
});

export default APIParams;
