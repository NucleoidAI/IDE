import Button from "@mui/material/Button";
import OpenAI from "../icons/OpenAI";
import React from "react";

const OpenAIButton = ({ clickEvent }) => {
  return (
    <Button
      data-cy="openAI-dialog-button"
      sx={{
        position: "relative",
        textTransform: "none",
        bottom: 20,
        left: 15,
      }}
      onClick={clickEvent}
      startIcon={<OpenAI />}
    >
      OpenAI
    </Button>
  );
};

export default OpenAIButton;
