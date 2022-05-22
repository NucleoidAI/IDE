import CodeSandbox from "../icons/CodeSandbox";
import React from "react";
import { Box, Typography } from "@mui/material";

const RunCodesandbox = ({ handleOpenSandboxDialog }) => {
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

export default RunCodesandbox;
