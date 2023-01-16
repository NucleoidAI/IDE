import React from "react";
import TranslateIcon from "@mui/icons-material/Translate";
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
        <TranslateIcon htmlColor="black" />
      )}
    </IconButton>
  );
};

export default OpenAICodeExplainButton;
