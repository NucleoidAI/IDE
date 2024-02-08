import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Settings from "../../components/Settings";
import Logo from "../../components/Logo";

const ChatHistory = ({ chats }) => {
  const handleChatClick = (chatId) => {
    console.debug(`Chat clicked: ${chatId}`);
  };

  return (
    <List sx={{ width: "100%" }}>
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
          <ListItemText primary={chat.chatTitle} />
        </ListItemButton>
      ))}
    </List>
  );
};

const ChatSideBar = () => {
  const chatData = [
    { chatId: "1", chatTitle: "What is the circumfrance of the Earth?" },
    { chatId: "2", chatTitle: "How to center a div?" },
    { chatId: "3", chatTitle: "What do blind people see in their dreams?" },
  ];

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      p={2}
    >
      <Box sx={{ flexGrow: 0 }}>
        <Logo title={"Chat"} />
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <ChatHistory chats={chatData} />
      </Box>
      <Box sx={{ flexGrow: 0 }}>
        <Settings size={"large"} />
      </Box>
    </Box>
  );
};

export default ChatSideBar;
