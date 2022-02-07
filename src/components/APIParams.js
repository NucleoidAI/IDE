import AddIcon from "@mui/icons-material/Add";
import ParamTable from "./ParamTable";
import { Fab, Grid } from "@mui/material";
import { forwardRef, useRef } from "react";

const APIParams = forwardRef((props, paramsRef) => {
  const addParams = useRef();
  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"space-between"}
      sx={{ height: "100%" }}
    >
      <Grid item sx={{ margin: 2, height: 350 }}>
        <ParamTable ref={{ paramsRef: paramsRef, addParams: addParams }} />
      </Grid>
      <Grid container item justifyContent="flex-end">
        {/* TODO Move add icon into ParamTable */}
        <Fab size={"small"} onClick={() => addParams.current()}>
          <AddIcon />
        </Fab>
      </Grid>
    </Grid>
  );
});

export default APIParams;
