import AddIcon from "@mui/icons-material/Add";
import ParamTable from "../ParamTable";
import styles from "./styles";
import { Fab, Grid } from "@mui/material";
import { forwardRef, useRef } from "react";

const APIParams = forwardRef((props, paramsRef) => {
  const addParams = useRef();
  return (
    <Grid container sx={styles.root}>
      <Grid item sx={styles.params}>
        <ParamTable ref={{ paramsRef: paramsRef, addParams: addParams }} />
      </Grid>
      <Grid container item sx={styles.button}>
        {/* TODO Move add icon into ParamTable */}
        <Fab size={"small"} onClick={() => addParams.current()}>
          <AddIcon />
        </Fab>
      </Grid>
    </Grid>
  );
});

export default APIParams;
