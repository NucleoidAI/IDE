import CodeSandbox from "../icons/CodeSandbox";
import React from "react";
import { Box, Typography } from "@mui/material";

const OpenSandbox = ({ handleOpenSandboxDialog, create, fill }) => {
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
      <Typography
        sx={{ pl: 2 }}
        fontFamily={"Trebuchet MS"}
        variant={"h6"}
        onClick={handleOpenSandboxDialog}
      >
        {!create && "try it in codesandbox"}
        {create && "Open Sandbox"}
      </Typography>
      <Box />
    </Box>
  );
};

export default OpenSandbox;
