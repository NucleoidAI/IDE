import ChatMenu from "../../widgets/ChatMenu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Outlet } from "react-router-dom"; // eslint-disable-line

import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";

function ChatContainer() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

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
          width: "18%",
          overflow: "hidden",
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          transition: "transform 0.3s ease-in-out",
          transform: isSidebarVisible ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <ChatMenu />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "white",
          transition: "margin-left 0.3s ease-in-out",
          marginLeft: isSidebarVisible ? "18%" : "0",
          width: "100%",
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => setSidebarVisible(!isSidebarVisible)}
          sx={{
            color: "white",
            position: "absolute",
            top: "50%",
            left: "1rem",
            transform: "translateY(-50%)",
            zIndex: 1300,
          }}
        >
          {isSidebarVisible ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>

        <Outlet />
      </Box>
    </Box>
  );
}

export default ChatContainer;
