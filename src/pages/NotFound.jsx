import { publish } from "@nucleoidai/react-event";

import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";

function NotFound() {
  useEffect(() => {
    setTimeout(() => {
      publish("PAGE_LOADED", { name: "NotFound" });
    }, 5000);
  }, []);

  return (
    <Stack
      direction={"column"}
      sx={{
        width: 1,
        alignItems: "center",
        bgcolor: "#323a40",
        justifyContent: "space-evenly",
      }}
    >
      <Typography variant="h1" sx={{ color: "#28a745" }}>
        404
      </Typography>
      <Typography variant="h2" sx={{ color: "#dfdfdf" }}>
        Page Not Found
      </Typography>
      <Box
        component={"img"}
        src="https://cdn.nucleoid.com/media/d1afb01b-ca2e-4752-8f5b-d01f9c73e8d6.png"
      />
    </Stack>
  );
}

export default NotFound;
