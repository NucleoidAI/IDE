import "./ChatMainArea.css";

import ChatDisplay from "./ChatDisplay";
import MessageInput from "./MessageInput";
import SuggestionsOverlay from "./SuggestionsOverlay";
import useChat from "./useChat";
import { useEvent } from "@nucleoidjs/react-event";

import { Box, useTheme } from "@mui/material";
import React, { useRef, useState } from "react";

const Chat = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const messageInputRef = useRef();
  const [chatId] = useEvent("CHAT_ID_CHANGED", 0);
  const { chat, sendMessage } = useChat(chatId);

  const handleSendMessage = (message) => {
    sendMessage(chatId, message, setLoading);

    messageInputRef.current.clear();
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
      <ChatDisplay chat={chat} loading={loading} />
      <MessageInput
        handleSendMessage={handleSendMessage}
        ref={messageInputRef}
        loading={loading}
      />
    </Box>
  );
};

export default Chat;
