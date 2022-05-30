import React from "react";
import Swagger from "../icons/Swagger";
import { Box, Button, Typography } from "@mui/material";

const OpenSwaggerButton = ({ clickEvent }) => {
  return (
    <Button
      onClick={clickEvent}
      size={"large"}
      sx={{ width: "100%", color: "#A5A7AB", textTransform: "none" }}
    >
      <Box
        sx={{
          pt: 1,
          pb: 2,
          display: "flex",
          cursor: "pointer",
          alignItems: "center",
        }}
      >
        <Swagger />
        <Typography sx={{ pl: 2 / 3 }} fontFamily={"Trebuchet MS"}>
          Open Swagger
        </Typography>
        <Box />
      </Box>
    </Button>
  );
};

export default OpenSwaggerButton;
