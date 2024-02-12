import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEvent } from "@nucleoidjs/react-event";
import useChat from "./useChat";
import Prism from "prismjs";
import "prismjs/themes/prism-twilight.css";
import "prismjs/components/prism-typescript";

const ChatDisplay = ({ chat }) => {
  const theme = useTheme();

  useEffect(() => {
    Prism.highlightAll();
  }, [chat]);

  return (
    <Box
      sx={{
        overflow: "auto",
        flex: 1,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        userSelect: "text",
      }}
    >
      {chat?.messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            width: "60%",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "10px",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            userSelect: "text",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", marginBottom: "8px", userSelect: "text" }}
          >
            {message.sender.toUpperCase()}
          </Typography>
          <Typography variant="body1" sx={{ userSelect: "text" }}>
            {message.text}
          </Typography>
          {message.code && (
            <Box
              component="pre"
              sx={{
                overflowX: "auto",
                justifyContent: "center",
                marginTop: "8px",
                backgroundColor: theme.palette.grey[100],
                borderRadius: "5px",
                padding: "10px",
                userSelect: "text",
                width: "100%",
              }}
            >
              <Box component="code" className="language-typescript">
                {message.code}
              </Box>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

const ChatMainArea = () => {
  const theme = useTheme();
  const [chatId] = useEvent("CHAT_ID_CHANGED", 0);
  const [inputValue, setInputValue] = useState("");
  const chat = useChat(chatId);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      const newMessage = { sender: "human", text: inputValue };
      setInputValue("");
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
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
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "10px",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "70%",
            borderRadius: "20px",
            padding: "10px",
            border: `1px solid `,
            borderColor: theme.palette.grey[400],
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Type your message here..."
            value={inputValue}
            onChange={handleInputChange}
            multiline
            maxRows={4}
            InputProps={{
              disableUnderline: true,
              style: { color: (theme) => theme.palette.grey[600] },
            }}
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            type="submit"
            sx={{ color: (theme) => theme.palette.grey[600], ml: 1 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatMainArea;
