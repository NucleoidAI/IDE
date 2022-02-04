import ParamView from "./ParamView";
import React from "react";
import Schema from "./Schema";
import { Divider, Grid } from "@mui/material";

const APIBody = React.forwardRef(({ method }, ref) => {
  const { requestRef, responseRef, paramsRef } = ref;
  const params = [];
  if (requestRef.current || responseRef.current || paramsRef.current)
    Object.keys(paramsRef.current).forEach((key) => {
      params.push(paramsRef.current[key]);
    });

  return (
    <Grid container justifyContent={"space-between"} sx={{ height: "100%" }}>
      <Grid item md sx={{ margin: 3 }}>
        {requestRef && method === "get" && (
          <>
            <br />
            <ParamView params={params} />
          </>
        )}
        {requestRef && method !== "get" && (
          <Schema request edit ref={requestRef} />
        )}
      </Grid>
      <Divider orientation={"vertical"} flexItem sx={{ height: 350 }} />
      <Grid item md sx={{ margin: 3 }}>
        {responseRef && <Schema response edit ref={responseRef} />}
      </Grid>
    </Grid>
  );
});

export default APIBody;
