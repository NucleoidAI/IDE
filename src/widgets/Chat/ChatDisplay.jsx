import ChatEditor from "./ChatEditor";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ChatDisplay = ({ chat, loading }) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  const messagesContainerRef = useRef(null);

  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleOpenDialog = (code) => {
    setSelectedCode(code);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const atBottom = Math.abs(scrollTop + clientHeight - scrollHeight) < 1;
      setIsAtBottom(atBottom);
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [chat?.messages]);

  useEffect(() => {
    setTimeout(scrollToBottom, 0);
  }, []);

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
      }}
      ref={messagesContainerRef}
      onScroll={handleScroll}
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
            sx={{
              fontWeight: "bold",
              marginBottom: "8px",
              userSelect: "text",
            }}
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
                padding: "0",
                userSelect: "text",
                width: "100%",
              }}
              onClick={() => handleOpenDialog(message.code)}
            >
              <ChatEditor code={message.code} readOnly={true} />
            </Box>
          )}
        </Box>
      ))}
      {!isAtBottom && (
        <Button
          onClick={scrollToBottom}
          sx={{ position: "fixed", bottom: 20, right: 20 }}
        >
          Scroll to Bottom
        </Button>
      )}
      {loading && <CircularProgress />}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth={true}
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "30vh",
            maxHeight: "60vh",
            width: "60%",
          },
        }}
      >
        <DialogTitle>Code Analysis</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "100%" }}>
            <ChatEditor code={selectedCode} readOnly={true} />
          </Box>
        </DialogContent>
        <Button onClick={handleCloseDialog}>Close</Button>
      </Dialog>
    </Box>
  );
};
export default ChatDisplay;
