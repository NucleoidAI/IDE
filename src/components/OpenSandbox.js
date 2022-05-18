import React, { useState } from "react";
import { Box, Fab, Tooltip, Typography } from "@mui/material";
import CodeSandbox from "../icons/CodeSandbox";
import service from "../service";
import CodeSandboxDialog from "./CodeSandboxDialog";

const OpenSandbox = ({  }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        onClick={handleClickOpen}
      >
        open codesandbox
      </Typography>
      {open && <CodeSandboxDialog handleClose={handleClose} />}
      <Box />
    </Box>
  );
};

export default OpenSandbox;
