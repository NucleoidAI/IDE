import "./ChatMainArea.css";

import ChatDisplay from "./ChatDisplay";
import DisclaimerMessage from "./DisclaimerMessage";
import MessageInput from "./MessageInput";
import Settings from "../../settings";
import SuggestionsOverlay from "./SuggestionsOverlay";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";
import useChat from "./useChat";
import { useEvent } from "@nucleoidai/react-event";
import { useParams } from "react-router-dom";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ChatWidget = () => {
  const theme = useTheme();
  const { chatId } = useParams("chatId");

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [codeResponse, setCodeResponse] = useState(false);
  const [isItFirstVisit, setIsItFirstVisit] = useState();
  const [loading, setLoading] = useState(false);
  const [landingLevel] = useEvent(
    "ONBOARDING_LEVEL_ACHIEVED",
    storage.get("chat", "onboarding") || { level: 0 }
  );
  const [chatMessageResponded] = useEvent("CHAT_MESSAGE_RESPONDED", null);
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
      if (landingLevel.level === 0) {
        setIsItFirstVisit(true);
      } else {
        setIsItFirstVisit(false);
      }

      if (session.messages.filter((message) => message.code).length >= 1) {
        setCodeResponse(true);
        storage.set("ide", "terminal", chatId);
      } else {
        setCodeResponse(false);
      }
      publish("WIDGET_LOADED", {
        name: "ChatWidget",
      });
    }
  };

  useEffect(() => {
    loadChat().then();
    // eslint-disable-next-line
  }, [chatId]);

  useEffect(() => {
    if (chat.messages.filter((message) => message.code).length === 1) {
      setCodeResponse(true);
      storage.set(
        "ide",
        "terminal",
        `https://nucleoid.com/sandbox/terminal/${chatId}`
      );
      storage.set("ide", "app", `https://nucleoid.com/sandbox/${chatId}/`);
    }
    // eslint-disable-next-line
  }, [chatMessageResponded]);

  const handleSendMessage = async (suggestion) => {
    setLoading(true);
    const first = !chat.messages.length;
    const userMessage =
      suggestion?.description || messageInputRef.current.getValue();
    userMessageRef.current = userMessage;
    messageInputRef.current.clear();

    try {
      await sendMessage(userMessage);

      if (first) {
        publish("CHAT_INITIATED", chat.id);
      }
    } catch (error) {
      publish("EXPERT_ERROR_OCCURRED", {
        chatId: chat.id,
        type: error.response.data.type,
        content: error.response.data.content,
      });
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
        paddingBottom: isMobile ? "25px" : "10px",
      }}
    >
      <ChatDisplay
        currentUserMessage={userMessageRef.current}
        chat={chat}
        loading={loading}
        error={error}
        refreshChat={refreshChat}
        codeResponse={codeResponse}
        codeCollapsed={Settings.collapseCodeBlocks}
      />

      <SuggestionsOverlay
        onSuggestionClick={handleSendMessage}
        chat={chat}
        loading={loading}
        error={error}
      />

      <MessageInput
        handleSendMessage={handleSendMessage}
        ref={messageInputRef}
        loading={loading}
        showConvertToProject={codeResponse}
        highlightConvertToProject={isItFirstVisit && landingLevel.level === 1}
      />

      <DisclaimerMessage />
    </Box>
  );
};

export default ChatWidget;
