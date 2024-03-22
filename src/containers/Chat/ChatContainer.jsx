import { Box } from "@mui/material";
import ChatMenu from "../../widgets/ChatMenu";
import { Outlet } from "react-router-dom"; // eslint-disable-line
import React from "react";
import routes from "../../routes";
import styles from "./styles";
import { useEffect } from "react";

import { publish, useEvent } from "@nucleoidai/react-event";

function ChatContainer() {
  const [event] = useEvent("PAGE_LOADED", { name: "" });

  useEffect(() => {
    if (event.name) {
      publish("CONTAINER_LOADED", {
        name: "ChatContainer",
      });
    }
  }, [event.name]);

  return (
    <Box sx={styles.root}>
      <ChatMenu list={routes} title="Chat" />
      <Box sx={styles.content}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default ChatContainer;
