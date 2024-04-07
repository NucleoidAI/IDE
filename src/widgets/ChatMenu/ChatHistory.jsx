import CodeIcon from "@mui/icons-material/Code";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ToggleableMenu from "../../components/ToggleableMenu";
import { storage } from "@nucleoidjs/webstorage";
import styles from "./styles.js";
import { useNavigate } from "react-router-dom";

import {
  Box,
  IconButton,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { publish, useEvent } from "@nucleoidai/react-event";

function ChatHistory() {
  const navigate = useNavigate();
  const [selectedChat] = useEvent("CHAT_SELECTED");
  const [initChat] = useEvent("CHAT_INITIATED");
  const [chats, setChats] = useState([]);

  const handleChatClick = (chatId) => navigate(`/chat/${chatId}`);
  const handleConvertToProject = (chatId) => {
    publish("CONVERT_TO_PROJECT", chatId);
    storage.set("ide", "landing", { level: 2 });
    publish("LANDING_LEVEL_ACHIEVED", { level: 2 });
  };
  const handleDeleteChat = (chatId) => {
    console.log(`Deleting chat ${chatId}`);
  };

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
              <ToggleableMenu defaultIcon={<MoreVertIcon fontSize="small" />}>
                <Tooltip title="Convert to Project">
                  <IconButton
                    size="small"
                    onClick={() => handleConvertToProject(chat.id)}
                  >
                    <CodeIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Chat">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteChat(chat.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ToggleableMenu>
            </ListItemButton>
          </React.Fragment>
        ))}
    </Box>
  );
}

export default ChatHistory;
