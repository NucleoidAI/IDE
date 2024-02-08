import React, { useState } from "react";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatDisplay = ({ chat }) => {
  return (
    <Box
      sx={{
        overflow: "auto",

        flex: 1,
        padding: "20px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {chat.messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            width: "60%",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: message.sender === "ai" ? "#333" : "#555",
            color: "white",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", marginBottom: "8px" }}
          >
            {message.sender.toUpperCase()}
          </Typography>
          <Typography variant="body2">{message.text}</Typography>
        </Box>
      ))}
    </Box>
  );
};

const ChatMainArea = () => {
  const [inputValue, setInputValue] = useState("");
  const [chat, setChat] = useState({
    id: "1",
    title: "Chat with GPT",
    messages: [
      { sender: "ai", text: "Hello! How can I assist you today?" },
      { sender: "human", text: "Can you tell me more about React?" },
      {
        sender: "ai",
        text: "Certainly! React is a JavaScript library for building user interfaces.",
      },
    ],
  });

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      const newMessage = { sender: "human", text: inputValue };
      setChat({ ...chat, messages: [...chat.messages, newMessage] });
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
        backgroundColor: "#121212",
        color: "white",

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
          backgroundColor: "#121212",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "70%",
            border: "1px solid white",
            borderRadius: "20px",
            padding: "10px",
            backgroundColor: "#121212",
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
            InputProps={{ disableUnderline: true }}
            sx={{ flexGrow: 1, ".MuiInputBase-input": { color: "white" } }}
          />
          <IconButton type="submit" sx={{ color: "white", ml: 1 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatMainArea;
