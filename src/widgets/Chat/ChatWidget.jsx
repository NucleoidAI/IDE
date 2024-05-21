import React, { useEffect, useRef, useState } from "react";
import { Box, useTheme, Snackbar, Alert } from "@mui/material";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";
import { useEvent } from "@nucleoidai/react-event";
import { useParams } from "react-router-dom";
import ChatDisplay from "./ChatDisplay";
import MessageInput from "./MessageInput";
import Settings from "../../settings";
import SuggestionsOverlay from "./SuggestionsOverlay";
import useChat from "./useChat";
import "./ChatMainArea.css";

const ChatWidget = () => {
  const theme = useTheme();
  const { chatId } = useParams("chatId");

  const [loading, setLoading] = useState(false);
  const [landingLevel] = useEvent(
    "ONBOARDING_LEVEL_ACHIEVED",
    storage.get("chat", "onboarding") || { level: 0 }
  );
  const messageInputRef = useRef();
  const userMessageRef = useRef("");
  const [chat, sendMessage] = useChat();
  const [error, setError] = useState({}); // State to manage errors
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control Snackbar visibility

  const loadChat = async () => {
    if (chatId) {
      try {
        // Verify chat is valid in local storage
        const session = await storage.get("ide", "chat", "sessions", chatId);
        publish("CHAT_SELECTED", session);

        publish("WIDGET_LOADED", {
          name: "ChatWidget",
        });
      } catch (err) {
        setError("Could not connect to the server.");
        setSnackbarOpen(true);
      }
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

    try {
      await sendMessage(userMessage);
      if (first) {
        publish("CHAT_INITIATED", chat.id);
      }
    } catch (err) {
      setError("Failed to send message.");
      setSnackbarOpen(true);
    }

    setLoading(false);
  };

  const handleSuggestionClick = async (suggestion) => {
    const first = !chat.messages.length;
    setLoading(true);
    userMessageRef.current = suggestion.description;

    try {
      await sendMessage(suggestion.description);
      if (first) {
        publish("CHAT_INITIATED", chat.id);
      }
    } catch (err) {
      setError("Failed to connect network.");
      setSnackbarOpen(true);
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

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
        disableConvertToProject={landingLevel.level === 3}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatWidget;
