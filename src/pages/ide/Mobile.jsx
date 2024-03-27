import CardMedia from "@mui/material/CardMedia";
import React from "react";
import { publish } from "@nucleoidai/react-event";
import { useEffect } from "react";

import {
  Box,
  CssBaseline,
  Grid,
  Stack,
  Typography,
  styled,
} from "@mui/material";

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

  useEffect(() => {
    publish("CONTAINER_LOADED", { name: "Mobile" });
    const timer = setTimeout(() => {
      window.location.href = "https://nucleoid.com/docs";
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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
        <Stack
          direction={"column"}
          sx={{
            display: "flex",
            height: 1,
            width: 1,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <CardMedia
            component="img"
            image="https://cdn.nucleoid.com/media/d1afb01b-ca2e-4752-8f5b-d01f9c73e8d6.png"
            sx={{ width: 300, height: 300 }}
          />
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
              <Typography
                display={"inline"}
                fontSize={"18px"}
                color={"#dfdfdf"}
              >
                IDE
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Typography
                display={"inline"}
                fontSize={"16px"}
                color={"#dfdfdf"}
              >
                Nucleoid IDE cannot be used on mobile devices
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
};

export default Mobile;
