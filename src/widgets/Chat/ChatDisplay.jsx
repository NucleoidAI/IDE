import Avatar from "@mui/material/Avatar";
import ChatEditor from "./ChatEditor";
import ErrorMessage from "./components/ErrorMessage";
import { GitHub } from "@mui/icons-material";
import GraphImage from "../../images/graph.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MessageBox from "./components/MessageBox";
import WelcomeMessage from "./components/WelcomeMessage";
import { storage } from "@nucleoidjs/webstorage";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Fade,
  Tooltip,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { publish, useEvent } from "@nucleoidai/react-event";

const ChatDisplay = ({
  chat,
  loading,
  error,
  refreshChat,
  currentUserMessage,
  codeCollapsed,
  codeResponse,
}) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  const [showScrollToBottomButton, setShowScrollToBottomButton] =
    useState(false);
  const [suggestionsOverlay] = useEvent("SUGGESTIONS_OVERLAY", {
    active: false,
  });

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
      setShowScrollToBottomButton(
        !atBottom &&
          window.innerWidth >= 960 &&
          chat.messages.length > 0 &&
          !suggestionsOverlay.active
      );
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 0);
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
        paddingX: { xs: "8px", sm: "16px", md: "20px" },
        paddingTop: "20px",
        paddingBottom: {
          xs: suggestionsOverlay.active ? 8 : 1,
          sm: suggestionsOverlay.active ? 12.5 : 2.5,
        },
      }}
      ref={messagesContainerRef}
      onScroll={handleScroll}
    >
      <Tooltip
        title="NucleoidAI/Nucleoid"
        onClick={() =>
          window.open("http://github.com/NucleoidAI/Nucleoid", "_blank")
        }
        sx={{
          position: "absolute",
          top: "10px",
          right: "20px",
          cursor: "pointer",
        }}
      >
        <Fab variant="button">
          <GitHub />
        </Fab>
      </Tooltip>
      {codeResponse && (
        <Fade in={true} timeout={1000}>
          <Tooltip
            title="Graph"
            onClick={() =>
              publish("GRAPH_DIALOG_OPENED", {
                terminalUrl: storage.get("ide.terminal"),
              })
            }
            sx={{
              position: "absolute",
              top: "10px",
              right: "85px",
              cursor: "pointer",
            }}
          >
            <Fab variant="button">
              <Avatar sx={{ p: 0.5 }} src={GraphImage} />
            </Fab>
          </Tooltip>
        </Fade>
      )}

      {chat && chat.messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        chat &&
        chat.messages.map((message, index) => (
          <MessageBox
            key={index}
            message={message}
            handleOpenDialog={handleOpenDialog}
            isCodeCollapsed={codeCollapsed}
          />
        ))
      )}
      {loading && <MessageBox onlyUser currentMessage={currentUserMessage} />}
      <ErrorMessage
        show={error.chatId === chat.id}
        content={error.content}
        type={error.type}
        refreshChat={refreshChat}
      />
      {showScrollToBottomButton && (
        <Fab
          onClick={scrollToBottom}
          variant="transparent"
          size="small"
          sx={{
            position: "absolute",
            bottom: { xs: 16, sm: 24, md: 94 },
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
        >
          <KeyboardArrowDownIcon />
        </Fab>
      )}
      {loading && <CircularProgress />}
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
