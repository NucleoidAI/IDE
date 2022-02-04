import AddIcon from "@mui/icons-material/Add";
import ParamTable from "./ParamTable";
import { Fab, Grid } from "@mui/material";
import { forwardRef, useRef } from "react";

const APIParams = forwardRef((props, ref) => {
  const paramsRef = ref.current;
  const addParamRef = useRef();

  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"space-between"}
      sx={{ height: "100%" }}
    >
      <Grid item sx={{ margin: 2, height: 350 }}>
        <ParamTable ref={{ paramsRef: paramsRef, addParamRef: addParamRef }} />
      </Grid>
      <Grid container item justifyContent="flex-end">
        <Fab size={"small"} onClick={() => addParamRef.current()}>
          <AddIcon />
        </Fab>
      </Grid>
    </Grid>
  );
});

export default APIParams;
