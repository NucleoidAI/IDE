import React from "react";

import { Box, CssBaseline, Grid, Typography, styled } from "@mui/material";

const Mobile = () => {
  const Nucleoid = styled("span")({
    "@keyframes pulsate": {
      from: {
        textShadow:
          "0 0 25px #323a40, 0 0 25px #323a40, 0 0 25px #323a40, 0 0 25px #2f5a40, 0 0 25px #2f5a40, 0 0 25px #2f5a40, 0 25px #2f5a40, 0 0 100px #2f5a40",
      },
      to: {
        textShadow:
          "text-shadow: 0 0 5px #323a40, 0 0 5px #323a40, 0 0 5px #323a40, 0 0 20px #2f5a40, 0 0 5px #2f5a40, 0 0 5px #2f5a40, 0 0 5px #2f5a40, 0 0 5px #2f5a40",
      },
    },
    color: "#28a745",
    animation: "pulsate 3s ease",

    fontSize: "22px",
  });

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          bgcolor: "#323a40",
        }}
      >
        <Grid container flexDirection={"row"} sx={{ height: 100 }}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px",
            }}
          >
            <Nucleoid>Nucleoid</Nucleoid> &nbsp;
            <Typography display={"inline"} fontSize={"18px"} color={"#dfdfdf"}>
              IDE
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography display={"inline"} fontSize={"18px"} color={"#dfdfdf"}>
              Nucleoid IDE cannot be used on mobile devices
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Mobile;
