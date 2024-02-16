import { Box } from "@mui/material";
import React from "react";

function ChatLayout({ content }) {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "white",
          transition: "margin-left 0.3s ease-in-out",

          width: "100%",
          position: "relative",
        }}
      >
        {content}
      </Box>
    </Box>
  );
}

export default ChatLayout;
