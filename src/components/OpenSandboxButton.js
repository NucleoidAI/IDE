import CodeSandbox from "../icons/CodeSandbox";
import React from "react";
import { Box, Button, Typography } from "@mui/material";

const OpenSandboxButton = ({ clickEvent, fill }) => {
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
        <CodeSandbox fill={fill} />
        <Typography sx={{ pl: 2 / 3 }} fontFamily={"Trebuchet MS"}>
          Open CodeSandbox
        </Typography>
        <Box />
      </Box>
    </Button>
  );
};

export default OpenSandboxButton;
