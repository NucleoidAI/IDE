import AddIcon from "@mui/icons-material/Add";
import Drawer from "@mui/material/Drawer";
import Logo from "../../components/Logo";
import React from "react";
import Settings from "../../components/Settings";
import { publish } from "@nucleoidjs/react-event";

import {
  Box,
  Fab,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  useTheme,
} from "@mui/material";

const ChatHistory = ({ chats }) => {
  const theme = useTheme();
  const handleChatClick = (chatId) => {
    publish("CHAT_ID_CHANGED", chatId);
    console.debug(`Chat clicked: ${chatId}`);
  };

  return (
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
  );
};

const ChatMenu = ({ isSidebarVisible }) => {
  const chatData = [
    { chatId: "0", chatTitle: "What is the circumference of the Earth?" },
    { chatId: "1", chatTitle: "How to center a div?" },
    { chatId: "2", chatTitle: "What do blind people see in their dreams?" },
    { chatId: "3", chatTitle: "Problem of criterion" },
  ];

  const handleCreateNewChat = () => {
    publish("CHAT_ID_CHANGED", "-1");
  };
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
        <Fab
          variant="button"
          edge="start"
          size="small"
          onClick={handleCreateNewChat}
          sx={{ alignSelf: "center", my: 2 }}
        >
          <AddIcon />
        </Fab>
        <ChatHistory chats={chatData} />
      </Stack>
      <Settings size={"large"} />
    </Drawer>
  );
};

export default ChatMenu;
