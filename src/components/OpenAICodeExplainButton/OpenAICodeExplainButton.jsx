import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import React from "react";
import { CircularProgress, IconButton } from "@mui/material";

const OpenAICodeExplainButton = ({ clickEvent, progress }) => {
  return (
    <IconButton
      onClick={clickEvent}
      disabled={progress}
      sx={{ position: "absolute", right: 30, top: 15 }}
    >
      {progress ? (
        <CircularProgress size={25} />
      ) : (
        <HelpOutlineIcon htmlColor="black" />
      )}
    </IconButton>
  );
};

export default OpenAICodeExplainButton;
