import "./ChatMainArea.css";

import ChatDisplay from "./ChatDisplay";
import MessageInput from "./MessageInput";
// import SuggestionsOverlay from "./SuggestionsOverlay";
import { publish } from "@nucleoidjs/react-event";
import { storage } from "@nucleoidjs/webstorage";
import useChat from "./useChat";
import { useEvent } from "@nucleoidjs/react-event";
import { v4 as uuid } from "uuid";

import { Box, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Chat = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { chatId } = useParams("chatId");
  const [loading, setLoading] = useState(false);
  const messageInputRef = useRef();
  const [chat, sendMessage] = useChat();
  const [error] = useEvent("EXPERT_ERROR_OCCURRED", {
    status: false,
    type: "",
    content: "",
  });

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
    } else {
      // TODO Verify chat is valid in local storage
      const session = storage.get("ide", "chat", "sessions", chatId);
      publish("CHAT_SELECTED", session);
    }
  }, [chatId, navigate]);

  const handleSendMessage = async (message) => {
    setLoading(true);
    const first = !chat.messages.length;

    await sendMessage(message, setLoading);

    if (first) {
      publish("CHAT_INITIATED", chat.id);
    }

    setLoading(false);
    messageInputRef.current.clear();
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
      <ChatDisplay chat={chat} loading={loading} error={error} />
      <MessageInput
        handleSendMessage={handleSendMessage}
        ref={messageInputRef}
        loading={loading}
      />
    </Box>
  );
};

export default Chat;
