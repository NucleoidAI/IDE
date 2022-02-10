import ParamView from "../ParamView";
import Schema from "../Schema";
import styles from "./styles";
import { Divider, Grid } from "@mui/material";
import React, { forwardRef } from "react";

const APIBody = forwardRef(({ method, params }, { request, response }) => {
  return (
    <Grid container justifyContent={"space-between"} sx={styles.root}>
      <Grid item md sx={styles.schema}>
        {method === "get" && (
          <>
            <br />
            <ParamView
              params={Object.keys(params.current).map((item) => {
                return params.current[item];
              })}
            />
          </>
        )}
        {method !== "get" && <Schema request ref={request} />}
      </Grid>
      <Divider orientation={"vertical"} sx={styles.divider} />
      <Grid item md sx={styles.schema}>
        <Schema response ref={response} />
      </Grid>
    </Grid>
  );
});

export default APIBody;
