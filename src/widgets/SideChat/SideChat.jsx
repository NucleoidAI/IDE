import Box from "@mui/material/Box";
import ChatDisplay from "../Chat/ChatDisplay";
import MessageInput from "../Chat/MessageInput";
import Settings from "../../settings";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";
import useChat from "../Chat/useChat";
import { useEvent } from "@nucleoidai/react-event";
import { useParams } from "react-router-dom";

import React, { useEffect, useRef, useState } from "react";

function SideChat() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const session = storage.get("ide", "chat", "sessions", id);
  const messageInputRef = useRef();
  const userMessageRef = useRef("");
  const [chat, sendMessage] = useChat();
  const [error] = useEvent("EXPERT_ERROR_OCCURRED", {
    chatId: "",
    status: false,
    type: "",
    content: "",
  });

  useEffect(() => {
    if (session) {
      publish("CHAT_SELECTED", session);
    } else {
      //Init chat with empty session
    }
  }, []);

  useEffect(() => {
    if (error.status) {
      setLoading(false);
    }
  }, [error.status]);

  const refreshChat = () => {
    messageInputRef.current.setValue(userMessageRef.current);
    publish("EXPERT_ERROR_OCCURRED", {
      status: false,
      type: "",
      content: "",
    });
  };

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
        error={error}
        refreshChat={refreshChat}
        codeCollapsed={Settings.collapseCodeBlocks}
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
