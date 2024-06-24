import React from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material";

const DisclaimerMessage = () => {
  const theme = useTheme();
  return (
    <Typography
      variant="body2"
      align="center"
      style={{ color: theme.palette.grey[500] }}
    >
      This is a beta version, please report errors to repo
    </Typography>
  );
};

export default DisclaimerMessage;
