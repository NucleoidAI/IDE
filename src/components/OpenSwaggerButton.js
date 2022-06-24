import React from "react";
import Swagger from "../icons/Swagger";
import theme from "../theme";
import { Box, Button, Typography } from "@mui/material";

const OpenSwaggerButton = ({ clickEvent, small }) => {
  return (
    <Button
      onClick={clickEvent}
      size={"large"}
      sx={{ width: "100%", color: "#A5A7AB", textTransform: "none" }}
    >
      <Box
        sx={{
          display: "flex",
          cursor: "pointer",
          alignItems: "center",
        }}
      >
        {!small && (
          <>
            <Swagger fill={theme.palette.custom.grey} />
            <Typography sx={{ pl: 3 / 2 }} fontFamily={"Trebuchet MS"}>
              Open Swagger
            </Typography>
            <Box />
          </>
        )}

        {small && <Swagger fill={theme.palette.custom.grey} />}
      </Box>
    </Button>
  );
};

export default OpenSwaggerButton;
