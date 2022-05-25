import CodeSandbox from "../icons/CodeSandbox";
import React from "react";
import { Box, Typography } from "@mui/material";

const OpenSandbox = ({ fill }) => {
  return (
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
  );
};

export default OpenSandbox;
