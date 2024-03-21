import { Box } from "@mui/material";
import ChatMenu from "../../widgets/ChatMenu";
import { Outlet } from "react-router-dom"; // eslint-disable-line
import React from "react";
import routes from "../../routes";
import styles from "./styles";
import { publish } from "@nucleoidjs/react-event";

import { useEffect } from "react";

function ChatContainer() {
  useEffect(() => {
    publish("CONTAINER_LOADING_COMPLETED");
  }, []);

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
