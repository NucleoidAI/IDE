import React from "react";
import Swagger from "../icons/Swagger";
import { useTheme } from "@mui/material/styles";

import { Box, Button, Typography } from "@mui/material";

const OpenSandboxButton = ({ clickEvent, small, disabled }) => {
  const theme = useTheme();
  return (
    <Button
      disabled={disabled}
      onClick={clickEvent}
      size={"large"}
      sx={{
        width: "100%",
        color: "#A5A7AB",
        textTransform: "none",
        "&:disabled": {
          color: "#6a7178",
        },
      }}
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
            <Swagger fill={theme.palette.custom.grey} disabled={disabled} />
            <Typography sx={{ pl: 3 / 2 }} fontFamily={"Trebuchet MS"}>
              Open Sandbox
            </Typography>
            <Box />
          </>
        )}

        {small && (
          <Swagger fill={theme.palette.custom.grey} disabled={disabled} />
        )}
      </Box>
    </Button>
  );
};

export default OpenSandboxButton;
