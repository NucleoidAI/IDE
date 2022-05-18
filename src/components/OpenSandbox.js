import React, { useState } from "react";
import { Box, Fab, Tooltip, Typography } from "@mui/material";
import CodeSandbox from "../icons/CodeSandbox";
import service from "../service";

const OpenSandbox = ({ handleOpenSandboxDialog }) => {
  return (
    <Box
      sx={{
        pt: 1,
        pb: 2,
        display: "flex",
        //  justifyContent: "space-between",
        cursor: "pointer",
        alignItems: "center",
      }}
    >
      <CodeSandbox />
      <Typography
        sx={{ pl: 2 }}
        fontFamily={"Trebuchet MS"}
        variant={"h6"}
        onClick={handleOpenSandboxDialog}
      >
        try it in codesandbox
      </Typography>
      <Box />
    </Box>
  );
};

export default OpenSandbox;
