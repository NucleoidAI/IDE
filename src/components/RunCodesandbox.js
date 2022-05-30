import CodeSandbox from "../icons/CodeSandbox";
import React from "react";
import { Box, Typography } from "@mui/material";

const RunCodesandbox = ({ handleRunSandbox }) => {
  return (
    <Box
      sx={{
        pt: 1,
        pb: 1,
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
        onClick={handleRunSandbox}
      >
        try it in codesandbox
      </Typography>
      <Box />
    </Box>
  );
};

export default RunCodesandbox;
