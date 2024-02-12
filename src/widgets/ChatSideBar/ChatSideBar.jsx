import React from "react";
import {
  Box,
  List,
  Button,
  ListItemButton,
  ListItemText,
  Divider,
  Icon,
  useTheme,
} from "@mui/material";
import Settings from "../../components/Settings";
import Logo from "../../components/Logo";
import { publish } from "@nucleoidjs/react-event";
import AddIcon from "@mui/icons-material/Add";

const ChatHistory = ({ chats }) => {
  const theme = useTheme();
  const handleChatClick = (chatId) => {
    publish("CHAT_ID_CHANGED", chatId);
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
          <ListItemText
            sx={{ color: theme.palette.custom.grey }}
            primary={chat.chatTitle}
          />
        </ListItemButton>
      ))}
    </List>
  );
};

const ChatSideBar = () => {
  const theme = useTheme();
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor:
          theme.components.MuiDrawer.styleOverrides.paper.backgroundColor,
      }}
      p={2}
    >
      <Box sx={{ flexGrow: 0 }}>
        <Logo title={"Chat"} />
      </Box>

      <Box sx={{ flexGrow: 0, my: 2 }}>
        <Divider sx={{ my: 2 }} />
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleCreateNewChat}
          fullWidth
        >
          Create New Chat
        </Button>
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
