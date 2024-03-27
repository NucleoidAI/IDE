import { Box } from "@mui/material";
import ChatMenu from "../../widgets/ChatMenu";
import { Outlet } from "react-router-dom"; // eslint-disable-line
import React from "react";
import routes from "../../routes";
import { storage } from "@nucleoidjs/webstorage";
import styles from "./styles";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";

import { publish, useEvent } from "@nucleoidai/react-event";
import { useNavigate, useParams } from "react-router-dom";

function Chat() {
  const [event] = useEvent("PAGE_LOADED", { name: "" });
  const navigate = useNavigate();
  const { chatId } = useParams("chatId");

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
