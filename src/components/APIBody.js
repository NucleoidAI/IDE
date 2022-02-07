import ParamView from "./ParamView";
import Schema from "./Schema";
import { Divider, Grid } from "@mui/material";
import React, { forwardRef } from "react";

const APIBody = forwardRef(({ method, params }, { request, response }) => {
  return (
    <Grid container justifyContent={"space-between"} sx={{ height: "100%" }}>
      <Grid item sx={{ margin: 3 }}>
        {method === "get" && (
          <>
            <br />
            <ParamView params={params} />
          </>
        )}
        {method !== "get" && <Schema request ref={request} />}
      </Grid>
      <Divider orientation={"vertical"} style={{ height: 350 }} />
      <Grid item sx={{ margin: 3 }}>
        <Schema response ref={response} />
      </Grid>
    </Grid>
  );
});

export default APIBody;
