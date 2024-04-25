import Box from "@mui/material/Box";
import ChatDisplay from "../Chat/ChatDisplay";
import MessageInput from "../Chat/MessageInput";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";
import useChat from "../Chat/useChat";
import { useParams } from "react-router-dom";

import React, { useEffect, useRef, useState } from "react";

function SideChat() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const session = storage.get("ide", "chat", "sessions", id);

  useEffect(() => {
    if (session) {
      publish("CHAT_SELECTED", session);
    } else {
      //Init chat with empty session
    }
  }, []);

  const messageInputRef = useRef();
  const userMessageRef = useRef("");
  const [chat, sendMessage] = useChat();

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: (theme) => theme.palette.background.paper,
        paddingBottom: "10px",
        width: 700,
      }}
    >
      <ChatDisplay
        currentUserMessage={userMessageRef.current}
        chat={chat}
        loading={loading}
        error={false}
        refreshChat={false}
        codeCollapsed={false}
      />
      <MessageInput
        handleSendMessage={handleSendMessage}
        ref={messageInputRef}
        loading={loading}
        showConvertToProject={false}
      />
    </Box>
  );
}

export default SideChat;
