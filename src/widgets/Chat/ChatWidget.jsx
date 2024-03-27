import "./ChatMainArea.css";

import ChatDisplay from "./ChatDisplay";
import MessageInput from "./MessageInput";
// import SuggestionsOverlay from "./SuggestionsOverlay";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";
import useChat from "./useChat";
import { useEvent } from "@nucleoidai/react-event";
import { useParams } from "react-router-dom";

import { Box, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ChatWidget = () => {
  const theme = useTheme();
  const { chatId } = useParams("chatId");

  const [loading, setLoading] = useState(false);
  const messageInputRef = useRef();
  const userMessageRef = useRef("");
  const [chat, sendMessage] = useChat();
  const [error] = useEvent("EXPERT_ERROR_OCCURRED", {
    status: false,
    type: "",
    content: "",
  });
  const loadChat = async () => {
    if (chatId) {
      // TODO Verify chat is valid in local storage

      // Requires async call
      const session = await storage.get("ide", "chat", "sessions", chatId);
      publish("CHAT_SELECTED", session);

      publish("WIDGET_LOADED", {
        name: "ChatWidget",
      });
    }
  };

  useEffect(() => {
    loadChat();
    // eslint-disable-next-line
  }, [chatId]);

  const handleSendMessage = async () => {
    setLoading(true);
    const first = !chat.messages.length;
    const userMessage = messageInputRef.current.getValue();
    userMessageRef.current = userMessage;
    messageInputRef.current.clear();

    await sendMessage(userMessage, setLoading);

    if (first) {
      publish("CHAT_INITIATED", chat.id);
    }

    setLoading(false);
  };

  const refreshChat = () => {
    messageInputRef.current.setValue(userMessageRef.current);
    publish("EXPERT_ERROR_OCCURRED", {
      status: false,
      type: "",
      content: "",
    });
  };

  useEffect(() => {
    if (error.status) {
      setLoading(false);
    }
  }, [error.status]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        paddingBottom: "10px",
      }}
    >
      <ChatDisplay
        currentUserMessage={userMessageRef.current}
        chat={chat}
        loading={loading}
        error={error}
        refreshChat={refreshChat}
      />
      <MessageInput
        handleSendMessage={handleSendMessage}
        ref={messageInputRef}
        loading={loading}
      />
    </Box>
  );
};

export default ChatWidget;
