import "./ChatMainArea.css";

import ChatDisplay from "./ChatDisplay";
import MessageInput from "./MessageInput";
import SuggestionsOverlay from "./SuggestionsOverlay";
import useChat from "./useChat";
import { useEvent } from "@nucleoidjs/react-event";

import { Box, useTheme } from "@mui/material";
import React, { useRef } from "react";

const Chat = () => {
  const theme = useTheme();
  const messageInputRef = useRef();
  const [chatId] = useEvent("CHAT_ID_CHANGED", 0);
  const chat = useChat(chatId);

  const handleSendMessage = (message) => {
    console.log(message);
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
      <ChatDisplay chat={chat} />
      <SuggestionsOverlay setInputValue={() => {}} />
      <MessageInput
        handleSendMessage={handleSendMessage}
        ref={messageInputRef}
      />
    </Box>
  );
};

export default Chat;
