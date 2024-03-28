import styles from "./styles.js";
import { useEvent } from "@nucleoidai/react-event";
import { useNavigate } from "react-router-dom";
import { Box, ListItemButton, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";

function ChatHistory() {
  const navigate = useNavigate();
  const [selectedChat] = useEvent("CHAT_SELECTED");
  const [initChat] = useEvent("CHAT_INITIATED");
  const [chats, setChats] = useState([]);

  const handleChatClick = (chatId) => navigate(`/chat/${chatId}`);

  useEffect(() => {
    const menu = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith("ide.chat.sessions.")) {
        try {
          const { id, title, created, messages } = JSON.parse(
            localStorage.getItem(key)
          );
          menu.push({ id, title, created, length: messages.length });
          // eslint-disable-next-line no-empty
        } catch (err) {}
      }
    }

    setChats(menu.sort((a, b) => b.created - a.created));
  }, [selectedChat, initChat]);

  return (
    <Box sx={{ marginTop: "10px" }}>
      {chats
        .filter((chat) => chat.length)
        .map((chat) => (
          <React.Fragment key={chat.id}>
            <ListItemButton
              onClick={() => handleChatClick(chat.id)}
              sx={styles.listItem}
            >
              <ListItemText
                primary={chat.title}
                sx={{
                  ".MuiListItemText-primary": {
                    position: "relative",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </ListItemButton>
          </React.Fragment>
        ))}
    </Box>
  );
}

export default ChatHistory;
