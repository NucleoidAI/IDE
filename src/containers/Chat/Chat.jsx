import ChatMenu from "../../widgets/ChatMenu";
import Onboarding from "./Onboarding";
import { Outlet } from "react-router-dom"; // eslint-disable-line
import Settings from "../../settings";
import routes from "../../routes";
import { storage } from "@nucleoidjs/webstorage";
import styles from "./styles";
import { v4 as uuid } from "uuid";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { publish, useEvent } from "@nucleoidai/react-event";
import { useNavigate, useParams } from "react-router-dom";

Onboarding.init();

function Chat() {
  const [event] = useEvent("PAGE_LOADED", { name: "" });
  const navigate = useNavigate();
  const { chatId } = useParams("chatId");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (isMobile) {
      Settings.collapseCodeBlocks(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (event.name) {
      publish("CONTAINER_LOADED", {
        name: "ChatContainer",
      });
    }
  }, [event.name]);

  useEffect(() => {
    if (!chatId) {
      const chatId = uuid();
      storage.set("ide", "chat", "sessions", chatId, {
        id: chatId,
        title: "New Chat",
        messages: [],
        created: Date.now(),
      });
      navigate(`/chat/${chatId}`);
    }
  }, [chatId, navigate]);

  return (
    <Box sx={styles.root}>
      <ChatMenu list={routes} title="Chat" />
      <Box sx={styles.content}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Chat;
