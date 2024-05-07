import "./ChatMainArea.css";

import ChatDisplay from "./ChatDisplay";
import MessageInput from "./MessageInput";
import Settings from "../../settings";
import SuggestionsOverlay from "./SuggestionsOverlay";
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
  const [landingLevel] = useEvent("ONBOARDING_LEVEL_ACHIEVED", {
    level: Number.MAX_SAFE_INTEGER,
  });
  const messageInputRef = useRef();
  const userMessageRef = useRef("");
  const [chat, sendMessage] = useChat();
  const [error] = useEvent("EXPERT_ERROR_OCCURRED", {
    chatId: "",
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
    loadChat().then();
    // eslint-disable-next-line
  }, [chatId]);

  const handleSendMessage = async () => {
    setLoading(true);
    const first = !chat.messages.length;
    const userMessage = messageInputRef.current.getValue();
    userMessageRef.current = userMessage;
    messageInputRef.current.clear();

    await sendMessage(userMessage);

    if (first) {
      publish("CHAT_INITIATED", chat.id);
    }

    setLoading(false);
  };

  const handleSuggestionClick = async (suggestion) => {
    const first = !chat.messages.length;
    setLoading(true);
    userMessageRef.current = suggestion.description;

    await sendMessage(suggestion.description);

    if (first) {
      publish("CHAT_INITIATED", chat.id);
    }
    setLoading(false);
  };

  const refreshChat = () => {
    messageInputRef.current.setValue(userMessageRef.current);
  };

  useEffect(() => {
    if (error) {
      setLoading(false);
    }
  }, [error]);

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
        codeCollapsed={Settings.collapseCodeBlocks}
      />

      <SuggestionsOverlay
        onSuggestionClick={handleSuggestionClick}
        chat={chat}
        loading={loading}
        error={error}
      />

      <MessageInput
        handleSendMessage={handleSendMessage}
        ref={messageInputRef}
        loading={loading}
        showConvertToProject={landingLevel.level === 1}
      />
    </Box>
  );
};

export default ChatWidget;
