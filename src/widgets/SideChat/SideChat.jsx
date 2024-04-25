import Box from "@mui/material/Box";
import ChatDisplay from "../Chat/ChatDisplay";
//import MessageInput from "../Chat/MessageInput";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";
import useChat from "../Chat/useChat";
import { useParams } from "react-router-dom";

import React, { useEffect, useRef } from "react";

function SideChat() {
  const { id } = useParams();

  const session = storage.get("ide", "chat", "sessions", id);

  useEffect(() => {
    if (session) {
      publish("CHAT_SELECTED", session);
    } else {
      //Init chat with empty session
    }
  }, []);

  //const messageInputRef = useRef();
  const userMessageRef = useRef("");
  const [chat] = useChat();

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
        loading={false}
        error={false}
        refreshChat={false}
        codeCollapsed={false}
      />
    </Box>
  );
}

export default SideChat;
