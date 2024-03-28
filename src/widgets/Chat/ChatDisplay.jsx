import ChatEditor from "./ChatEditor";
import ErrorMessage from "./components/ErrorMessage";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MessageBox from "./components/MessageBox";
import WelcomeMessage from "./components/WelcomeMessage";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ChatDisplay = ({
  chat,
  loading,
  error,
  refreshChat,
  currentUserMessage,
}) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  const messagesContainerRef = useRef(null);

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

      const scrollToBottomButton = document.getElementById(
        "scrollToBottomButton"
      );
      if (scrollToBottomButton) {
        scrollToBottomButton.style.display =
          atBottom || window.innerWidth < 960 || chat.messages.length === 0
            ? "none"
            : "block";
      }
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 10);
  }, [chat]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [currentUserMessage]);

  return (
    <Box
      sx={{
        overflow: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        paddingX: {
          xs: "8px",
          sm: "16px",
          md: "20px",
        },
        paddingY: "20px",
      }}
      ref={messagesContainerRef}
      onScroll={handleScroll}
    >
      {chat && chat.messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        chat &&
        chat.messages.map((message, index) => (
          <MessageBox
            key={index}
            message={message}
            handleOpenDialog={handleOpenDialog}
          />
        ))
      )}
      {loading && <MessageBox onlyUser currentMessage={currentUserMessage} />}
      <ErrorMessage
        show={error.status}
        content={error.content}
        type={error.type}
        refreshChat={refreshChat}
      />

      <Fab
        onClick={scrollToBottom}
        variant="button"
        size="small"
        sx={{
          position: "absolute",
          bottom: { xs: 8, sm: 16, md: 86 },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          display: { xs: "none", md: "block" },
          "& > *": {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
        }}
        id="scrollToBottomButton"
      >
        <KeyboardArrowDownIcon />
      </Fab>

      <CircularProgress show={loading} />
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
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
