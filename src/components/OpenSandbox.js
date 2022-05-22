import CodeSandbox from "../icons/CodeSandbox";
import React from "react";
import { Box, Typography } from "@mui/material";

const OpenSandbox = ({ handleOpenSandboxDialog }) => {
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
      <CodeSandbox fill={"#c3c5c8"} />
      <Typography
        sx={{ pl: 2 / 3 }}
        fontFamily={"Trebuchet MS"}
        onClick={handleOpenSandboxDialog}
      >
        Open Sandbox
      </Typography>
      <Box />
    </Box>
  );
};

export default OpenSandbox;
