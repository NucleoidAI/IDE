import CodeSandbox from "../icons/CodeSandbox";
import React from "react";
import theme from "../theme";
import { Box, Button, Typography } from "@mui/material";

const OpenSandboxButton = ({ clickEvent, small }) => {
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
            <CodeSandbox fill={theme.palette.custom.grey} />
            <Typography sx={{ pl: 3 / 2 }} fontFamily={"Trebuchet MS"}>
              Open CodeSandbox
            </Typography>
            <Box />
          </>
        )}

        {small && <CodeSandbox fill={theme.palette.custom.grey} />}
      </Box>
    </Button>
  );
};

export default OpenSandboxButton;
