/* eslint-disable */

import ParamView from "../ParamView";
import Schema from "../Schema";
import styles from "./styles";

import { Divider, Grid } from "@mui/material";
import React, { forwardRef } from "react";

const APIBody = forwardRef(
  ({ method, params, types }, { requestRef, responseRef }) => {
    return (
      <Grid container justifyContent={"space-between"} sx={styles.root}>
        <Grid item md sx={styles.schema}>
          {method === "get" && (
            <>
              <br />
              <ParamView params={params} />
            </>
          )}

          {/*method !== "get" && (
            <Schema edit types={types} request ref={requestRef} />
          )*/}
        </Grid>
        <Divider orientation={"vertical"} sx={styles.divider} />
        <Grid item md sx={styles.schema}>
          {/*<Schema edit response types={types} ref={responseRef} />*/}
        </Grid>
      </Grid>
    );
  }
);

export default APIBody;
/* eslint-disable */
