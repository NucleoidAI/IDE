import AddIcon from "@mui/icons-material/Add";
import Drawer from "@mui/material/Drawer";
import Logo from "../../components/Logo";
import React from "react";
import Settings from "../../components/Settings";

import {
  Box,
  Fab,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  useTheme,
} from "@mui/material";
import { publish, useEvent } from "@nucleoidjs/react-event";
import { useEffect, useState } from "react";

const ChatHistory = () => {
  const theme = useTheme();
  const [chats, setChats] = useState([]);
  const [chatAdded] = useEvent("CHAT_ID_CHANGED", 0);

  const handleCreateNewChat = () => {
    publish("CHAT_ID_CHANGED", "-1");
  };

  const handleChatClick = (chatId) => {
    publish("CHAT_ID_CHANGED", chatId);
    console.debug(`Chat clicked: ${chatId}`);
  };

  useEffect(() => {
    const loadedChats = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith("chat.")) {
        try {
          const chatData = JSON.parse(localStorage.getItem(key));
          if (chatData) {
            loadedChats.push({
              chatId: chatData.id,
              chatTitle: chatData.title,
            });
          }
        } catch (e) {
          console.error("Error parsing chat data from local storage:", e);
        }
      }
    }
    setChats(loadedChats);
  }, [chatAdded]);

  return (
    <>
      <Fab
        variant="button"
        edge="start"
        size="small"
        onClick={handleCreateNewChat}
        sx={{ alignSelf: "center", my: 2 }}
      >
        <AddIcon />
      </Fab>
      <List sx={{ maxWidth: 350, width: "100%" }}>
        {chats.map((chat) => (
          <ListItemButton
            key={chat.chatId}
            onClick={() => handleChatClick(chat.chatId)}
            sx={{
              paddingX: 0,
              "& .MuiListItemText-root": {
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
            }}
          >
            <ListItemText
              sx={{ color: theme.palette.custom.grey }}
              primary={chat.chatTitle}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  );
};

const ChatMenu = ({ isSidebarVisible }) => {
  const chatData = [
    { chatId: "0", chatTitle: "What is the circumference of the Earth?" },
    { chatId: "1", chatTitle: "How to center a div?" },
    { chatId: "2", chatTitle: "What do blind people see in their dreams?" },
    { chatId: "3", chatTitle: "Problem of criterion" },
  ];

  return (
    <Drawer
      open={isSidebarVisible}
      variant="permanent"
      sx={{
        width: 350,
        "& .MuiDrawer-paper": {
          width: 350,
          boxSizing: "border-box",
          boxShadow: "inherit",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          margin: 2,
        }}
      >
        <Logo title={"Chat"} />
      </Box>

      <Stack sx={{ height: "100%", width: "100%" }}>
        <ChatHistory chats={chatData} />
      </Stack>
      <Settings size={"large"} />
    </Drawer>
  );
};

export default ChatMenu;
