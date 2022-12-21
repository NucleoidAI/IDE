import Button from "@mui/material/Button";
import OpenAI from "../icons/OpenAI";
import React from "react";

const OpenAIButton = ({ clickEvent }) => {
  return (
    <Button
      onClick={clickEvent}
      startIcon={<OpenAI />}
      sx={{
        position: "relative",
        textTransform: "none",
        bottom: 40,
        left: 10,
      }}
    >
      OpenAI
    </Button>
  );
};

export default OpenAIButton;
