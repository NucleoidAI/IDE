import React from "react";
import { Box } from "@mui/material";
import { publish } from "@nucleoidjs/react-event";
const ChatMainArea = () => {
  publish("EDITOR_LOADING_COMPLETED", true);

  return (
    <Box sx={{ background: "black", height: "100%" }} p={2}>
      Main Chat Area
    </Box>
  );
};

export default ChatMainArea;
